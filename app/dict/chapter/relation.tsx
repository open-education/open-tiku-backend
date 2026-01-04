import {Col, Row, Splitter} from "antd";

export default function Relation() {
  return <div className="mt-4">
    <Splitter style={{height: 300, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
      <Splitter.Panel
        defaultSize="50%"
        resizable={false}
      >
        <div className="p-3">

        </div>
      </Splitter.Panel>
      <Splitter.Panel
        defaultSize="50%"
        resizable={false}
      >
        <div className="p-3">

        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
}