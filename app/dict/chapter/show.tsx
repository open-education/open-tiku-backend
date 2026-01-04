import {
  Alert,
  Button,
  Cascader,
  type CascaderProps,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  type InputNumberProps,
  Row,
  Splitter
} from "antd";
import React, {useCallback, useState} from "react";
import type {Textbook, TextbookOption} from "~/type/textbook";
import {StringConst, StringValidator} from "~/util/string";
import {useFetcher} from "react-router";
import {httpClient} from "~/util/http";
import {ArrayUtil} from "~/util/object";

// 展示章节和知识点追加效果
export default function Show(props: any) {
  let fetcher = useFetcher();

  /// 展示区域层级数据
  const chapterShowItems: Textbook[] = props.chapterShowItems ?? [];

  /// 编辑区域菜单层级
  const [editChapterNameOptions, setEditChapterNameOptions] = React.useState<TextbookOption[]>([]);
  const [editChapterNameOption, setEditChapterNameOption] = React.useState<Textbook>({
    children: [],
    id: 0,
    key: "",
    label: "",
    parentId: 0,
    pathDepth: 0,
    sortOrder: 0
  });
  const [selectValues, setSelectValues] = useState<string[]>([]);
  const onParentLevelChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    setEditChapterNameOption(selectedOptions[selectedOptions.length - 1].raw);
  };

  /// 点击编辑区域编辑按钮
  const [editChapterNameId, setEditChapterNameId] = React.useState<number>(0);
  const onEditChapterNameClick = (id: number) => {
    console.log("editChapterName", id);
    setEditChapterNameId(id);

    // 获取最新的详情
    httpClient.get(`/textbook/info/${id}`).then(res => {
      setEditChapterName(res.label);
      setEditChapterSortOrder(res.sortOrder);
    }).catch(err => {
      console.log(err);
    });

    // 刷新菜单列表
    httpClient.get<Textbook[]>("/textbook/list/7/all").then(res => {
      const textbookOptions: TextbookOption[] = ArrayUtil.mapTextbookToOption(res);
      setEditChapterNameOptions(textbookOptions);

      // 为了友好需要选定默认值
      // 需要默认值信息
      const pathNodes = ArrayUtil.findPath(textbookOptions, id.toString());
      // 去掉最后一层, 该层为当前自己
      const _values = pathNodes ? pathNodes.slice(0, -1).map(node => node.label) : [];
      setSelectValues(_values);
    }).catch(err => {
      console.log(err);
    });
  }

  // 点击删除
  const [deleteChapterNameId, setDeleteChapterNameId] = React.useState<number>(0);
  const onDeleteChapterNameClick = (id: number) => {
    console.log("deleteChapterName", id);
    setDeleteChapterNameId(id);
  }

  // 编辑名称
  const [editChapterName, setEditChapterName] = React.useState<string>("");
  const onEditChapterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditChapterName(e.target.value);
    },
    []
  );

  // 排序编号
  const [editChapterSortOrder, setEditChapterSortOrder] = React.useState<number>(0);
  const onEditChapterSortOrderChange: InputNumberProps["onChange"] = (value) => {
    setEditChapterSortOrder(Number(value ?? 0));
  };

  // 为空判断
  const [chapterNodeIsEmpty, setChapterNodeIsEmpty] = React.useState(false);
  const [chapterIsEmpty, setChapterIsEmpty] = React.useState(false);

  // 提交编辑
  const submitEditChapterName = () => {
    if (editChapterNameId <= 0) {
      return;
    }
    // 该处编辑只能选择章节或者章节小节, 就是第6,7级菜单
    if (editChapterNameOption.pathDepth <= 5) {
      setChapterNodeIsEmpty(true);
      return;
    }
    setChapterNodeIsEmpty(false);

    // 名称为空
    if (!StringValidator.isNonEmpty(editChapterName)) {
      setChapterIsEmpty(true);
      return;
    }
    setChapterIsEmpty(false);

    // 提交编辑
    fetcher.submit({
      source: StringConst.dictChapterNameEdit,
      id: editChapterNameId,
      label: editChapterName,
      sortOrder: editChapterSortOrder,
      parentId: editChapterNameOption.id,
      pathDepth: editChapterNameOption.pathDepth + 1,
    }, {method: "post"}).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
    });
  }

  return <div className="mt-4">
    <Splitter style={{minHeight: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
      <Splitter.Panel
        defaultSize="40%"
        resizable={false}
      >
        <div className="p-3">
          <div>
            <Row gutter={[12, 12]}>
              <Col span={24}><span className="text-blue-700 font-normal">展示章节或知识点名称</span></Col>
            </Row>
          </div>

          <div className="mt-2">
            {
              chapterShowItems?.map((item: any, index: number) => {
                return <div className="bg-white" key={item.id}>
                  {/* 父目录 */}
                  <div className="flex items-center space-x-2 text-blue-950 font-bold">
                    <div>
                      <span className="w-2 h-2 bg-blue-950 rounded-full"></span>
                      <span>{item.label}</span>
                    </div>
                    <div>
                      <Flex gap="small" justify="flex-start">
                        <Button color="primary" variant="link" onClick={() => onEditChapterNameClick(item.id)}>
                          编辑
                        </Button>
                        <Button color="danger" variant="link" onClick={() => onDeleteChapterNameClick(item.id)}>
                          删除
                        </Button>
                      </Flex>
                    </div>
                  </div>

                  {/* 子目录容器：左侧垂直虚线 */}
                  {
                    item.children?.map((row: any, index: number) => {
                      {
                        /* border-l-2: 宽度 | border-dashed: 虚线 | border-blue-950: 颜色 */
                      }
                      return <div className="ml-1 border-l-2 border-dashed border-blue-950/40 pl-6 mt-1" key={row.id}>

                        {/* 子目录 */}
                        <div className="relative py-3 group">
                          {/* 水平虚线：通过 border-t 和 border-dashed 实现 */}
                          <div
                            className="absolute -left-6.5 top-1/2 w-6 border-t-2 border-dashed border-blue-950/40"></div>

                          <div className="flex items-center">
                            <div className="text-sm font-medium">{row.label}</div>

                            <div>
                              <Flex gap="small" justify="flex-start">
                                <Button color="primary" variant="link" onClick={() => onEditChapterNameClick(item.id)}>
                                  编辑
                                </Button>
                                <Button color="danger" variant="link" onClick={() => onDeleteChapterNameClick(item.id)}>
                                  删除
                                </Button>
                              </Flex>
                            </div>
                          </div>
                        </div>

                        {/* 最后一个子目录要特殊展示该行 这是一个技巧：用背景色块遮住最后一条子目录以下的垂直虚线 */}
                        {
                          item.children?.length - 1 == index &&
                          <div className="absolute -left-7 top-[50%] bottom-0 w-2 bg-white"></div>
                        }
                      </div>
                    })
                  }
                </div>
              })
            }
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel
        defaultSize="60%"
        resizable={false}
      >
        <div className="p-3">
          <div>
            <Row gutter={[12, 12]}>
              <Col span={24}><span className="text-blue-700 font-normal">编辑章节或知识点名称</span></Col>
            </Row>
          </div>

          <div className="mt-2">
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Form
                  layout="horizontal"
                  labelCol={{span: 4}}
                  wrapperCol={{span: 16}}
                >
                  <Form.Item label="选择教材章节或知识点类别">
                    <Cascader
                      style={{width: "80%"}}
                      changeOnSelect={true}
                      defaultValue={selectValues}
                      options={editChapterNameOptions}
                      onChange={onParentLevelChange}
                      placeholder="请选择教材章节或知识点类别"
                    />
                  </Form.Item>
                  <Form.Item label="名称: ">
                    <Input value={editChapterName} placeholder="请输入名称" onChange={onEditChapterChange}/>
                  </Form.Item>
                  <Form.Item label="排序编号: ">
                    <InputNumber
                      value={editChapterSortOrder}
                      type={"number"}
                      name="sortOrder"
                      mode="spinner"
                      min={0}
                      max={100}
                      placeholder="请输入排序编号, 数字"
                      onChange={onEditChapterSortOrderChange}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={submitEditChapterName}>编辑</Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={24}>
                {chapterNodeIsEmpty && <Alert title="请先选择 第一步: 选择教材章节或知识点类别" type={"error"}/>}
                {chapterIsEmpty && <Alert title="名称不能为空" type={"error"}/>}
              </Col>
            </Row>
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
}
