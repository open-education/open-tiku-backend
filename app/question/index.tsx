import type {Textbook, TextbookOption, TextbookOtherDict} from "~/type/textbook";
import {
  Alert,
  Cascader,
  type CascaderProps,
  Divider,
  Drawer,
  Empty,
  Form,
  Input,
  Layout,
  Modal,
  Pagination,
  Select,
  theme
} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import {httpClient} from "~/util/http";
import {ArrayUtil} from "~/util/object";
import type {QuestionEditStatusReq, QuestionListReq, QuestionListResp} from "~/type/question";
import {CommonTag} from "~/question/tag";
import {CommonTitle} from "~/question/title";
import {CommonSelect} from "~/question/select";
import "katex/dist/katex.min.css";
import {Approve} from "~/question/approve";
import {StringUtil} from "~/util/string";

const {Content} = Layout;
const {TextArea} = Input;

// 题目列表, 样式目前是拷贝前端的, 以后如果相似之处更多可以将两个项目中间抽象出一层样式组件来
export default function Index(props: any) {
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const textbookOptions: TextbookOption[] = props.textbookOptions ?? [];
  const optionInit: Textbook = {children: [], id: 0, key: "", label: "", parentId: 0, pathDepth: 0, sortOrder: 0};

  const [nodeOption, setNodeOption] = useState<Textbook>(optionInit);

  // 题型列表
  const [questionTypeList, setQuestionTypeList] = useState<TextbookOtherDict[]>([]);
  // 标签列表
  const [questionTagList, setQuestionTagList] = useState<TextbookOtherDict[]>([]);

  // 选择下拉菜单
  const onNodeOptionChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    if (selectedOptions === undefined) {
      setNodeOption(optionInit);
    } else {
      const info: Textbook = selectedOptions[selectedOptions.length - 1].raw;
      setNodeOption(info);
      // 需要去找题型类型和标签
      const nodes = ArrayUtil.findPath(textbookOptions, info.id.toString()) ?? [];
      // 题型类型和标签挂载在第三层上
      if (nodes.length < 3) {
        return;
      }
      // 目前题型和标签类型挂载在第三层上
      const reqId: number = nodes[2].raw.id;

      // 类型是在第三级上, 需要往上找-pathMap
      httpClient.get<TextbookOtherDict[]>(`/other/dict/list/${reqId}/question_type`).then(res => {
        setQuestionTypeList(res);
      }).catch(err => {
        setReqErr(<Alert title={`题型信息获取失败: ${err}`} type={"error"}/>);
      });
      httpClient.get<TextbookOtherDict[]>(`/other/dict/list/${reqId}/question_tag`).then(res => {
        setQuestionTagList(res);
      }).catch(err => {
        setReqErr(<Alert title={`标签信息获取失败: ${err}`} type={"error"}/>);
      });
    }
  }

  // 全局错误提示
  const [reqErr, setReqErr] = useState<React.ReactNode>("");

  // 目录列表
  const [childNodeOptions, setChildNodeOptions] = useState<TextbookOption[]>([]);
  const [childNodeOption, setChildNodeOption] = useState<Textbook>(optionInit);
  const onChildNodeOptionChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    if (selectedOptions === undefined) {
      setChildNodeOption(optionInit);
    } else {
      setChildNodeOption(selectedOptions[selectedOptions.length - 1].raw);
    }
  }

  // 教材和知识点变更时加载目录
  useEffect(() => {
    if (nodeOption.id <= 0) {
      return;
    }

    httpClient.get<Textbook[]>(`/textbook/list/${nodeOption.id}/children`).then(res => {
      setChildNodeOptions(ArrayUtil.mapTextbookToOption(res));
    }).catch(err => {
      setReqErr(<Alert title={err} type={err.type}/>);
    });
  }, [nodeOption]);

  // 审核下拉列表信息
  const approveOptions = [
    {value: "0", label: '草稿'},
    {value: "1", label: '待审核'},
    {value: "2", label: '审核通过'},
    {value: "3", label: '拒绝'},
  ];

  const [selectApproveVal, setSelectApproveVal] = useState<string>("0");
  const onSelectApproveValChange = (value: string) => {
    setSelectApproveVal(value);
  };

  const [pageNo, setPageNo] = useState<number>(1);
  const [questListResTotal, setQuestListResTotal] = useState<number>(0);
  const onPageChange = (page: number) => {
    setPageNo(page);
  }

  const [refreshListNum, setRefreshListNum] = useState<number>(0);
  const [questionListResp, setQuestionListResp] = useState<QuestionListResp>({
    list: [],
    pageNo: 0,
    pageSize: 0,
    total: 0
  });

  // 监听题型变更后请求接口读取题目列表
  useEffect(() => {
    if (childNodeOption.id <= 0) {
      return;
    }

    // 默认查询第一章第一节的题目列表
    const questionListReq: QuestionListReq = {
      questionCateId: childNodeOption.id,
      status: Number(selectApproveVal),
      pageNo: pageNo,
      pageSize: 10
    };
    httpClient.post<QuestionListResp>("/question/list", questionListReq).then(res => {
      setReqErr("");

      setQuestionListResp(res);
      setQuestListResTotal(res.total);
    }).catch(err => {
      setReqErr(<Alert
        title="Error"
        description={`读取题目列表出错: ${err.message}`}
        type="error"
        showIcon
      />)
    })
  }, [childNodeOption, refreshListNum, selectApproveVal, pageNo]);

  // Drawer
  const [addDrawerSize, setAddDrawerSize] = useState(1200);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>("");
  const drawerExtraInfo = <div className="text-xs text-blue-700">提示: 鼠标触摸边框左右拖动可以调整到适合的宽度</div>
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  // 审核 Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectId, setModalSelectId] = useState<number>(0);

  const [approveVal, setApproveVal] = useState<string>("0");
  const onApproveValChange = (value: string) => {
    setApproveVal(value);
  };

  const [rejectReason, setRejectReason] = useState<string>("");
  const onRejectReasonChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRejectReason(e.target.value);
    },
    []
  );
  const handleModalOk = () => {
    // 修改审核状态
    const req: QuestionEditStatusReq = {
      id: modalSelectId, rejectReason: rejectReason, status: Number(approveVal)
    };
    httpClient.post<boolean>("/edit/status", req).then(res => {
      setRefreshListNum(StringUtil.getRandomInt());
      setModalSelectId(0);
      setRejectReason("");
      setIsModalOpen(false);
    }).catch(err => {
      setReqErr(<Alert title={err} type={"error"}/>);
    });
  };
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setModalSelectId(0);
    setRejectReason("");
  };

  return <Layout style={{padding: "0", minHeight: "100vh"}}>
    <Content
      style={{
        padding: 24,
        margin: 0,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      {/* 搜索条件 */}
      <div>
        <Form
          layout={"inline"}
        >
          <Form.Item label="选择教材或知识点">
            <Cascader
              style={{width: "300"}}
              options={textbookOptions}
              onChange={onNodeOptionChange}
              placeholder="请选择选择教材或知识点类别"
            />
          </Form.Item>

          <Form.Item label="选择题型">
            <Cascader
              style={{width: "300"}}
              options={childNodeOptions}
              onChange={onChildNodeOptionChange}
              placeholder="选择题型"
            />
          </Form.Item>

          <Form.Item label="审核类型">
            <Select
              value={selectApproveVal}
              style={{width: 120}}
              onChange={onSelectApproveValChange}
              options={approveOptions}
            />
          </Form.Item>
        </Form>
      </div>

      {/* 错误提示区 */}
      <div>
        {reqErr}
      </div>

      <Divider size="small"/>

      {/* 题目列表区域 */}
      {/* 数据为空 */}
      {questionListResp.list?.length === 0 && <Empty/>}

      {/* 题目列表 */}
      {
        questionListResp.list?.map(questionInfo => {
          return <div key={questionInfo.id}>
            <div
              className="pt-4 pl-4 pr-4 pb-1 hover:border border-blue-950 border-dashed"
            >
              {/* 标签 */}
              {CommonTag(questionInfo, questionTypeList, questionTagList)}
              {/* 标题 */}
              {CommonTitle(questionInfo)}
              {/* 选项内容 */}
              {CommonSelect(questionInfo)}
              {/* 审核信息 */}
              {Approve(questionInfo, questionTypeList, questionTagList, setOpenDrawer, setDrawerContent, setIsModalOpen, setApproveVal, setModalSelectId)}
            </div>

            <Divider size="small"/>
          </div>
        })
      }

      <Pagination
        total={questListResTotal}
        current={pageNo}
        defaultPageSize={10}
        onChange={onPageChange}
      />

      {/* 详情信息 */}
      <Drawer
        title="查看详情"
        closable={{'aria-label': 'Close Button'}}
        onClose={onCloseDrawer}
        open={openDrawer}
        size={addDrawerSize}
        resizable={{
          onResize: (newSize) => setAddDrawerSize(newSize),
        }}
        extra={drawerExtraInfo}
      >
        {drawerContent}
      </Drawer>

      {/* 审核信息 */}
      <Modal
        title="信息审核"
        closable={{'aria-label': 'Custom Close Button'}}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form>
          <Form.Item label="审核类型">
            <Select
              value={approveVal}
              style={{width: 120}}
              onChange={onApproveValChange}
              options={approveOptions}
            />
          </Form.Item>
          <Form.Item label="拒绝理由">
            <TextArea value={rejectReason} rows={2} onChange={onRejectReasonChange}/>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  </Layout>
}
