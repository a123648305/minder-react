/* eslint-disable */
//@ts-nocheck
import "./App.css";
import "./assets/iconfont/iconfont.css";
import MinderPage from "./Minder";
import {
  getModulesList,
  getTreeData,
  getAlltags,
  importTreeData,
} from "./Minder/mock";

const App = (props) => {
  return (
    <div className="App">
      <MinderPage
        projectId="fa5cf22f6a154d66993611e7974a7c19"
        fetchApi={{
          getModulesList,
          getTreeData,
          getAlltags,
          importTreeData,
          saveTree: (data) =>
            fetch(
              "https://ironfist.fat.yuntingai.com/api/ironfist/newBusinessTag/usabletTag/fa5cf22f6a154d66993611e7974a7c19?businessId=111"
            ),
        }}
        type="tag"
        readonly={false}
        title="222222222222"
      ></MinderPage>
    </div>
  );
};

export default App;
