import React from "react";

import { ReactWidget } from "@jupyterlab/apputils";

import LockdownAndCustomSerializationComponent from "./LockdownAndCustomSerializationComponent";

export class LockdownAndCustomSerializationWidget extends ReactWidget {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  render(): JSX.Element {
    return (
      <div id={this.id + "_component"}>
        <LockdownAndCustomSerializationComponent />
      </div>
    );
  }
}

export default LockdownAndCustomSerializationWidget;
