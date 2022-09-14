import "./App.css";
import "./assets/iconfont/iconfont.css";
import MinderPage from "./Minder";

const App = () => {
  return (
    <div className="App">
      <MinderPage
        projectId="fa5cf22f6a154d66993611e7974a7c19"
        fetchApi={{
          getTreeData: () =>
            fetch(
              "https://ironfist.fat.yuntingai.com/api/ironfist/newBusinessTag/tree/save"
            ),
          getAlltags: () =>
            fetch(
              "https://ironfist.fat.yuntingai.com/api/ironfist/newBusinessTag/usabletTag/fa5cf22f6a154d66993611e7974a7c19?businessId=111"
            ),
        }}
        type="tag"
      ></MinderPage>
    </div>
  );
};

export default App;
