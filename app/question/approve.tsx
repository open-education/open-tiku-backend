import { Button, Col, Flex, Row } from "antd";
import type { QuestionBaseInfoResp, QuestionInfoResp } from "~/type/question";
import { Status } from "~/util/approve";
import React from "react";
import { httpClient } from "~/util/http";
import Info from "~/question/info";
import type { TextbookOtherDict } from "~/type/textbook";

// 审核信息
export function Approve(
  questionInfo: QuestionBaseInfoResp,
  questionTypeList: TextbookOtherDict[],
  questionTagList: TextbookOtherDict[],
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>,
  setDrawerContent: React.Dispatch<React.SetStateAction<React.ReactNode>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setApproveVal: React.Dispatch<React.SetStateAction<string>>,
  setModalSelectId: React.Dispatch<React.SetStateAction<number>>,
) {
  // 查看详情
  const onInfoClick = (id: number) => {
    setOpenDrawer(true);

    httpClient
      .get<QuestionInfoResp>(`/question/info/${id}`)
      .then((res) => {
        setDrawerContent(
          <Info
            questionInfo={res}
            questionTypeList={questionTypeList}
            questionTagList={questionTagList}
          />,
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 审核
  const onShowModalClick = (id: number, status: number) => {
    setIsModalOpen(true);
    setApproveVal(status.toString());
    setModalSelectId(id);
  };

  return (
    <div className="mt-3">
      <Row gutter={[12, 12]} align={"middle"}>
        {questionInfo.status == Status.Rejected && (
          <Col span={24}>
            <div>
              <span className="text-red-700">拒绝原因: </span>
              <span className="text-blue-700">{questionInfo.rejectReason}</span>
            </div>
          </Col>
        )}
        <Col span={24}>
          <Flex gap={"small"} justify={"flex-end"}>
            <Button
              color="primary"
              variant="link"
              onClick={() => onInfoClick(questionInfo.id)}
            >
              详情
            </Button>
            {questionInfo.status == Status.Draft && (
              <Button
                color="primary"
                variant="link"
                onClick={() =>
                  onShowModalClick(questionInfo.id, questionInfo.status)
                }
              >
                审核
              </Button>
            )}
          </Flex>
        </Col>
      </Row>
    </div>
  );
}
