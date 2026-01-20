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
  Splitter,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import type { Textbook, TextbookOption } from "~/type/textbook";
import { StringConst, StringConstUtil, StringValidator } from "~/util/string";
import { useFetcher } from "react-router";
import { httpClient } from "~/util/http";
import { ArrayUtil } from "~/util/object";

// 展示章节和知识点追加效果
export default function AppendShow(props: any) {
  let fetcher = useFetcher();

  /// 展示区域层级数据
  const chapterShowItems: Textbook[] = props.chapterShowItems ?? [];

  /// 编辑区域菜单层级
  const [editChapterNameOptions, setEditChapterNameOptions] = React.useState<
    TextbookOption[]
  >([]);
  const editOptionInit: Textbook = {
    children: [],
    id: 0,
    key: "",
    label: "",
    parentId: 0,
    pathDepth: 0,
    sortOrder: 0,
  };
  const [editChapterNameOption, setEditChapterNameOption] =
    React.useState<Textbook>(editOptionInit);
  const [selectValues, setSelectValues] = useState<string[]>([]);
  const onParentLevelChange: CascaderProps<TextbookOption>["onChange"] = (
    _,
    selectedOptions,
  ) => {
    if (selectedOptions === undefined) {
      setEditChapterNameOption(editOptionInit);
    } else {
      setEditChapterNameOption(selectedOptions[selectedOptions.length - 1].raw);
    }
  };

  /// 点击编辑区域编辑按钮
  const [editChapterNameId, setEditChapterNameId] = React.useState<number>(0);
  const onEditChapterNameClick = (id: number) => {
    console.log("editChapterName", id);
    setEditChapterNameId(id);

    // 获取最新的详情
    httpClient
      .get(`/textbook/info/${id}`)
      .then((res) => {
        setEditChapterName(res.label);
        setEditChapterSortOrder(res.sortOrder);
      })
      .catch((err) => {
        console.log(err);
      });

    // 刷新菜单列表
    httpClient
      .get<Textbook[]>("/textbook/list/7/all")
      .then((res) => {
        const textbookOptions: TextbookOption[] =
          ArrayUtil.mapTextbookToOption(res);
        setEditChapterNameOptions(textbookOptions);

        // 需要默认值信息
        const pathNodes = ArrayUtil.findPath(textbookOptions, id.toString());
        if (pathNodes) {
          const nodes = pathNodes.slice(0, -1);
          // 同时填充默认选择的菜单信息
          setEditChapterNameOption(nodes[nodes.length - 1].raw);
          // 去掉最后一层, 该层为当前自己
          setSelectValues(nodes.map((node) => node.label));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 点击删除, 删除成功后需要刷新节点展示列表
  const onDeleteChapterNameClick = (id: number, parentId: number) => {
    if (confirm("确定删除?")) {
      fetcher
        .submit(
          {
            source: StringConst.dictChapterNameRemove,
            id,
            parentId,
          },
          { method: "post" },
        )
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // 编辑名称
  const [editChapterName, setEditChapterName] = React.useState<string>("");
  const onEditChapterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditChapterName(e.target.value);
    },
    [],
  );

  // 排序编号
  const [editChapterSortOrder, setEditChapterSortOrder] =
    React.useState<number>(0);
  const onEditChapterSortOrderChange: InputNumberProps["onChange"] = (
    value,
  ) => {
    setEditChapterSortOrder(Number(value ?? 0));
  };

  // 为空判断
  const [chapterNodeIsEmpty, setChapterNodeIsEmpty] = React.useState(false);
  const [chapterNodeMaxDepthLimit, setChapterNodeMaxDepthLimit] =
    React.useState<boolean>(false);
  const [chapterIsEmpty, setChapterIsEmpty] = React.useState(false);

  // 提交编辑
  const submitEditChapterName = () => {
    if (editChapterNameId <= 0) {
      return;
    }
    // 该处编辑只能选择章节或者章节小节, 就是第6,7级菜单
    if (editChapterNameOption.id <= 0) {
      setChapterNodeIsEmpty(true);
      return;
    }
    setChapterNodeIsEmpty(false);
    if (
      !StringConstUtil.dictChapterNameAddMaxDepthSet.has(
        editChapterNameOption.pathDepth,
      )
    ) {
      setChapterNodeMaxDepthLimit(true);
      return;
    }
    setChapterNodeMaxDepthLimit(false);

    // 名称为空
    if (!StringValidator.isNonEmpty(editChapterName)) {
      setChapterIsEmpty(true);
      return;
    }
    setChapterIsEmpty(false);

    // 提交编辑
    fetcher
      .submit(
        {
          source: StringConst.dictChapterNameEdit,
          id: editChapterNameId,
          label: editChapterName,
          sortOrder: editChapterSortOrder,
          parentId: editChapterNameOption.id,
          pathDepth: editChapterNameOption.pathDepth + 1,
        },
        { method: "post" },
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 编辑时需要刷新节点展示列表
  const setChapterShowItems: React.Dispatch<React.SetStateAction<Textbook[]>> =
    props.setChapterShowItems;

  // 展示页面需要接收父级标识来刷新最新的子菜单列表
  useEffect(() => {
    // 父标识由 action 传递过来
    if (fetcher.data?.result === true && fetcher.data.parentId > 0) {
      httpClient
        .get<Textbook[]>(`/textbook/list/${fetcher.data.parentId}/part`)
        .then((res) => {
          setChapterShowItems(res);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    }
  }, [fetcher.data]);

  return (
    <div className="mt-4">
      <Splitter
        style={{ minHeight: 100, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel defaultSize="40%" resizable={false}>
          <div className="p-3">
            <div>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <span className="text-blue-700 font-normal">
                    展示章节或知识点名称
                  </span>
                </Col>
              </Row>
            </div>

            <div className="mt-2">
              {chapterShowItems?.map((item: any, index: number) => {
                return (
                  <div className="bg-white" key={item.id}>
                    {/* 父目录 */}
                    <div className="flex items-center space-x-2 text-blue-950 font-bold">
                      <div>
                        <span className="w-2 h-2 bg-blue-950 rounded-full"></span>
                        <span>{item.label}</span>
                      </div>
                      <div>
                        <Flex gap="small" justify="flex-start">
                          <Button
                            color="primary"
                            variant="link"
                            onClick={() => onEditChapterNameClick(item.id)}
                          >
                            编辑
                          </Button>
                          {(!item.children || item.children.length == 0) && (
                            <Button
                              color="danger"
                              variant="link"
                              onClick={() =>
                                onDeleteChapterNameClick(item.id, item.parentId)
                              }
                            >
                              删除
                            </Button>
                          )}
                        </Flex>
                      </div>
                    </div>

                    {/* 子目录容器：左侧垂直虚线 */}
                    {item.children?.map((row: any, index: number) => {
                      {
                        /* border-l-2: 宽度 | border-dashed: 虚线 | border-blue-950: 颜色 */
                      }
                      return (
                        <div
                          className="ml-1 border-l-2 border-dashed border-blue-950/40 pl-6 mt-1"
                          key={row.id}
                        >
                          {/* 子目录 */}
                          <div className="relative py-3 group">
                            {/* 水平虚线：通过 border-t 和 border-dashed 实现 */}
                            <div className="absolute -left-6.5 top-1/2 w-6 border-t-2 border-dashed border-blue-950/40"></div>

                            <div className="flex items-center">
                              <div className="text-sm font-medium">
                                {row.label}
                              </div>

                              <div>
                                <Flex gap="small" justify="flex-start">
                                  <Button
                                    color="primary"
                                    variant="link"
                                    onClick={() =>
                                      onEditChapterNameClick(row.id)
                                    }
                                  >
                                    编辑
                                  </Button>
                                  <Button
                                    color="danger"
                                    variant="link"
                                    onClick={() =>
                                      onDeleteChapterNameClick(
                                        row.id,
                                        item.parentId,
                                      )
                                    }
                                  >
                                    删除
                                  </Button>
                                </Flex>
                              </div>
                            </div>
                          </div>

                          {/* 最后一个子目录要特殊展示该行 这是一个技巧：用背景色块遮住最后一条子目录以下的垂直虚线 */}
                          {item.children?.length - 1 == index && (
                            <div className="absolute -left-7 top-[50%] bottom-0 w-2 bg-white"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="60%" resizable={false}>
          <div className="p-3">
            <div>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <span className="text-blue-700 font-normal">
                    编辑章节或知识点名称
                  </span>
                </Col>
              </Row>
            </div>

            <div className="mt-2">
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Form
                    layout="horizontal"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Form.Item label="选择教材章节或知识点类别">
                      <Cascader
                        style={{ width: "80%" }}
                        changeOnSelect={true}
                        value={selectValues}
                        options={editChapterNameOptions}
                        onChange={onParentLevelChange}
                        placeholder="请选择教材章节或知识点类别"
                      />
                    </Form.Item>
                    <Form.Item label="名称: ">
                      <Input
                        value={editChapterName}
                        placeholder="请输入名称"
                        onChange={onEditChapterChange}
                      />
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
                      <Button
                        color="primary"
                        variant="dashed"
                        onClick={submitEditChapterName}
                      >
                        编辑
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={24}>
                  {chapterNodeIsEmpty && (
                    <Alert
                      title="请先选择 第一步: 选择教材章节或知识点类别"
                      type={"error"}
                    />
                  )}
                  {chapterNodeMaxDepthLimit && (
                    <Alert
                      title="教材章节或知识点类别父级只能是第5级或第6级"
                      type={"error"}
                    />
                  )}
                  {chapterIsEmpty && (
                    <Alert title="名称不能为空" type={"error"} />
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}
