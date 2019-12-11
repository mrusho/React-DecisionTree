import * as React from "react";

const createChoice = (props: any, callback: any) => {
  return (
    <>
      <p style={{fontSize: "21px"}}>{props.name}</p>
      {props.options.map((o: any, index: number) => {
        return (
          <span key={index} style={{marginLeft: "10px"}}>
            <label>{o}</label>
            <input className={"custom-input"} type={"checkbox"} value={o} name={props.id} onChange={(e) => callback({id: props.id, type: props.type, name: props.name, val: e.target})} />
          </span>
        )
      })}
    </>
  )
};

const createBoolean = (props: any, callback: any) => {
  return (
    <>
      <p style={{fontSize: "21px"}}>{props.name}</p>
      {props.options.map((o: any, index: number) => {
        return (
          <span key={index} style={{marginLeft: "10px"}}>
            <label>{o}</label>
            <input className={"custom-input"} type={"radio"} value={o} name={props.id} defaultChecked={false} onChange={(e) => callback({id: props.id, type: props.type, name: props.name, val: e.target})} />
          </span>
        )
      })}
    </>
  )
};

export {createChoice, createBoolean};
