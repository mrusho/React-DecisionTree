import * as React from "react";
import {render} from "react-dom";
import {createBoolean, createChoice} from "./components/FormHelper";
import "./assets/css/app.scss";
// @ts-ignore
let tempData = require("./assets/data/testdata.json");

const Biomarker = () => {
  let [rootId, setRootId] = React.useState("decisionMap");
  let [activeId, setActiveId] = React.useState();
  let [userResponse, setUserResponse] = React.useState([]);
  let [topKeys, setTopKeys] = React.useState();
  let path = tempData["decisionMap"];

  React.useEffect(() => {
    setKeys().then((data) => {
      buildOptions(data);
    })
  }, [rootId]);

  const setKeys = async () => {
    let keyList: any[] | never[] = [];
    Object.keys(path).map((key: string) => {
      if (path[key].parentId && path[key].parentId === rootId) {
        if (userResponse.length >= 1) {
          let answers: any[] = [];
          userResponse.map((resp: any) => {
            if (resp.parentId === rootId) {
              if (typeof resp.value === "string") {
                answers.push(resp.value);
              } else {
                answers = answers.concat(resp.value);
              }
            }
          });

          // Check for match
          let match = path[key].preReqs.filter((item: any) => {
            return answers.indexOf(item) === -1
          });

          // @ts-ignore
          (match.length < 1)? keyList.push(path[key]) : null;
        } else {
          // @ts-ignore
          keyList.push(path[key]);
        }
      }
    });

    return keyList;
  };

  const buildOptions = (data: any) => {
    let items = data;

    console.log(items);

    items.map((e: any) => {
      e.element = [];
      e.name.map((i: any, index: number) => {
        if (e.fieldType) {
          let options = {id: e.id, type: e.fieldType[index], options: e.options[index], name: i};
          switch (e.fieldType[index]) {
            case "choice":
              e.element.push(createChoice(options, updateResponse));
              break;
            case "boolean":
              e.element.push(createBoolean(options, updateResponse));
              break;
          }
        }
      });
    });
    setActiveId((items[0])? items[0].id : null);
    setTopKeys(items);
  };

  const updateResponse = (data: any) => {
    let responseData = userResponse;
    let obj = {
      "id": data.name,
      "type": data.type,
      "value": data.val.value,
      "parentId": data.id,
      "checked": data.val.checked
    };

    if (responseData.length >= 1) {
      responseData.map((resp: any) => {
        if (resp.id === obj.id) {
          // Check if value is currently a string and convert to array
          if (resp.type === "choice" && typeof resp.value === "string") {
            resp.value = [resp.value];
          }

          // Check if object is checked or unchecked
          if (obj.checked) {
            resp.value = (resp.type === "choice") ? [...resp.value, obj.value] : [obj.value];
          } else {
            let index = resp.value.indexOf(obj.value);

            // If object value is found, remove
            if (index > -1) {
              resp.value.splice(index, 1);
            }
          }
        } else if (!checkFormData(responseData, obj.id)) {

          // @ts-ignore
          responseData.push(obj);
        }
      });

    } else {
      // @ts-ignore
      responseData.push(obj);
    }

    console.log(responseData);

    setUserResponse(responseData);
  };

  const checkFormData = (arr: any, id: any) => {
    return arr.some((el: any) => {
      return el.id === id;
    });
  };

  const traverseTree = (props: any) => {
    if (props.dir === "forward" && path[rootId].childIds) {

      if (path[rootId].childIds.length === 1) {
        setRootId(path[rootId].childIds[0]);
      } else {
        setRootId(activeId);
      }
    } else if (props.dir === "back") {
      let responseData = userResponse;
      if (responseData.length >= 1) {
        responseData = responseData.filter((item: any) => {
          return item.parentId !== rootId
        });
        setUserResponse(responseData);
      }
      setRootId(path[rootId].parentId);
    }
  };

  return (
    <>
      <div style={{width: "50%", float: "left"}}>
        <ul>
          {(rootId !== 'decisionMap')?
            <button onClick={() => traverseTree({dir: "back"})}><i className={"ion ion-md-arrow-round-back"}/> Back</button>
          : null}
          {(topKeys && topKeys.length >= 1)?
            topKeys.map((item: any, index: number) => {
              return <div key={index} id={item.id} onClick={(e) => (item.isAnswer || item.element.length > 0)? null : setRootId(e.currentTarget.id)} style={{color: (item.isAnswer)? "green" : "black"}}>{(item.element.length > 0)?
                item.element.map((el: any, index: number) => {
                  return <div key={index}>{el}</div>;
                })
                : (!item.isAnswer)? <button style={{cursor: "pointer", marginTop: 0}}>Start {item.name} Map</button> : <div style={{margin: "15px 0"}}>{item.name}<p>{JSON.stringify(item.preReqs)}</p></div>}</div>
            })
          : <p>There are no results based on your answers.</p>}
          {(rootId !== 'decisionMap')?
            <button onClick={() =>  traverseTree({dir: "forward"})}>Next</button>
            : null}
        </ul>
      </div>
      <div style={{width: "40%", float: "left", background: "#f2f3f8", padding: "0 15px"}}>
        <h3 style={{fontSize: "18px"}}>User Answers</h3>
        {(userResponse.length > 0)?
          userResponse.map((resp: any, index: number) => {
            return <div key={index}><p>Q: {resp.id}</p>
              <p style={{marginLeft: "10px"}}>{(typeof resp.value !== "string")?
                resp.value.map((v: any, index: number) => {return <li key={index}>{v}</li>}) : resp.value}</p>
              </div>
          })
        : null}
      </div>
    </>
  )
};


render (
  <>
    <link href={"https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css"} rel={"stylesheet"} />
    <Biomarker />
  </>, document.getElementById("biomarker-wrapper")
);
