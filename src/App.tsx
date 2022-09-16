import "./App.css";
import "./assets/iconfont/iconfont.css";
import MinderPage from "./Minder";

const App = () => {
  return (
    <div className="App">
      <MinderPage
        projectId="fa5cf22f6a154d66993611e7974a7c19"
        fetchApi={{
          getModulesList: (data) =>
            fetch(
              "https://ironfist.fat.yuntingai.com/api/ironfist/newBusinessTag/tree/save"
            ),
          getTreeData: (data) =>
            fetch(
              "https://ironfist.fat.yuntingai.com/api/ironfist/newBusinessTag/tree/save"
            ),
          getAlltags: (data) =>
            fetch(
              "https://ironfist.fat.yuntingai.com/api/ironfist/newBusinessTag/usabletTag/fa5cf22f6a154d66993611e7974a7c19?businessId=111"
            ),
          saveTree: (data) =>
            fetch(
              "https://ironfist.fat.yuntingai.com/api/ironfist/newBusinessTag/usabletTag/fa5cf22f6a154d66993611e7974a7c19?businessId=111"
            ),
          importTreeData: (data) =>
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
