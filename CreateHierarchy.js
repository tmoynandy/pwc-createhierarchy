import React, { Component } from 'react';
import update from 'immutability-helper';
import './style2.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default class CreateHierarchy extends Component {
  constructor() {
    super();
    this.state = {
      totalParent: 0,
      totalInput: 0,
      show: false,
      parentInputs: {}
    };
  }

  create = numOfFields => { };

  createFields = () => {
    let numParentHiers = this.state.totalParent;
    let parentInputs = {};
    let i;
    let newInput = {};
    for (i = 0; i < numParentHiers; i++) {
      let name = "hier-" + (i + 1);
      newInput = {
        value: "",
        children: {},
        totalChildren: 0,
        type: ""
      };
      parentInputs[name] = newInput;
    }
    this.setState({
      parentInputs: parentInputs
    });
  };

  createChild = hier => { };

  dropdown = e => {
    let val = e.target.name;
    // console.log(val);

    let parents = this.state.parentInputs;
    let parent = parents[val];

    parent.type = e.target.value;
    parents[val] = parent;

    this.setState({
      parentInputs: parents
    });
  };

  addChild = e => {
    let val = e.target.name;
    let parents = this.state.parentInputs;
    console.log(val);
    console.log(parents);
    let parent = parents[val];
    if (parent.type === "fixed" || parent.type === "") {
      window.alert("select type as dynamic");
    }
    else {
      let children = parent.children;
      let childObj = {
        value: "",
        parent: val,
        type: ""
      };
      // put the next line after children[newKey] = childObj in case of typeError
      parent.totalChildren = parent.totalChildren + 1;
      let newKey = "child-" + parent.totalChildren;
      children[newKey] = childObj;

      parent.children = children;
      parents[val] = parent;

      this.setState({
        parentInputs: parents
      });
    }

  };

  ChildDropdown = (e, parent) => {
    let val = e.target.value;
    let child = e.target.name;

    const newParentsInput = update(this.state.parentInputs,
      {
        [parent]: { children: { [child]: { type: { $set: val } } } }
      })
    console.log(newParentsInput);
    this.setState({
      parentInputs: newParentsInput
    })

  }

  handleChildAddBtn = (e, parent) => {
    let child = e.target.name;
    let childDropDownType = this.state.parentInputs[parent].children[child].type;
    if (childDropDownType === "fixed" || childDropDownType === "") {
      let newParentObj = {
        value: "",
        children: {},
        totalChildren: 0,
        type: ""
      }
      let parents = this.state.parentInputs;
      let totalParents = this.state.totalParent;
      parents["hier-" + (Number(totalParents) + 1)] = newParentObj;
      this.setState({
        parentInputs: parents,
        totalParent: Number(totalParents) + 1
      })
    }
    else {
      let parents = this.state.parentInputs;
      let par = parents[parent];
      let childObj = {
        value: "",
        type: "",
        parent: parent
      }
      let children = par.children;
      par.totalChildren = par.totalChildren + 1;
      let newKey = "child-" + par.totalChildren;
      children[newKey] = childObj;
      par.children = children;
      parents[parent] = par;

      this.setState({
        parentInputs: parents
      })

    }
  }

  handleParentHierChange = (e) => {
    let val = e.target.value;
    console.log(e.target.name);
    const newParent = update(this.state.parentInputs, {
      [e.target.name]: { value: { $set: val } }
    })
    this.setState({
      parentInputs: newParent
    })
  }

  handleChildHierChange = (e, parent) => {
    let val = e.target.value;
    let child = e.target.name;
    console.log(val, parent, child);
    const newParent = update(this.state.parentInputs, {
      [parent]: { children: { [child]: { value: { $set: val } } } }
    })

    this.setState({
      parentInputs: newParent
    })
  }

  render() {
    const parents = this.state.parentInputs;
    console.log("new state", this.state);
    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
              <div>Dynamic form</div>
            <br />
            <div ClassName="row">
              <div className="col">
                <div className="input-group mb-3">
                  <input
                    type="number"
                    onChange={e => {
                      this.setState({ totalParent: e.target.value });
                    }}
                    placeholder="no. of parent hierarchies"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" onClick={this.createFields}>Create</button>
                  </div>
                </div>
              </div>
            </div>



            {Object.keys(parents).map(
              (parent, id) => {
                return (
                  <React.Fragment>
                    <div className="row">
                      <div className="col">
                        <div className="parent1">
                          <div class="input-group mb-3">
                            <input key={id} name={"hier-" + (id + 1)} type="text" onChange={this.handleParentHierChange} placeholder={"hier-" + (id + 1)} />
                            <div class="input-group-append">
                              <button class="btn btn-primary" key={id + "btn"} name={"hier-" + (id + 1)} onClick={this.addChild}>
                                <FontAwesomeIcon icon={faPlus} />
                              </button>
                            </div>
                            <select
                              className = "form-control"
                              id={"type" + id}
                              name={"hier-" + (id + 1)}
                              key={id + "sel"}
                              onChange={this.dropdown}
                            >
                              <option disabled value="">
                                Select
                    </option>
                              <option value="fixed">Fixed</option>
                              <option value="dynamic">Dynamic</option>
                            </select>
                          </div>







                          <div className="card-md">
                            {Object.keys(this.state.parentInputs["hier-" + (id + 1)].children).map((data, idx) => {
                              return (
                                <React.Fragment>

                                  <div className="row">
                                    <div className="col">
                                      <div class="input-group mb-3">
                                        <input type="text" key={idx} name={"child-" + (idx + 1)} onChange={(e) => this.handleChildHierChange(e, "hier-" + (id + 1))} placeholder={"child-" + (idx + 1)} />
                                        <div class="input-group-append">
                                          <button
                                            className="btn btn-primary"
                                            name={"child-" + (idx + 1)}
                                            par={"hier-" + (id + 1)}
                                            onClick={(e) => this.handleChildAddBtn(e, "hier-" + (id + 1))}
                                          >
                                            <FontAwesomeIcon icon={faPlus} />
                                          </button>
                                        </div>
                                        <select
                                          className = "form-control"
                                          id={"type-" + idx}
                                          name={"child-" + (idx + 1)}
                                          par={"hier" + (id + 1)}
                                          key={idx + "-sel"}
                                          onChange={(e) => this.ChildDropdown(e, "hier-" + (id + 1))}
                                        >
                                          <option disabled value="">
                                            Select
                            </option>
                                          <option value="fixed">Fixed</option>
                                          <option value="dynamic">Dynamic</option>
                                        </select>
                                      </div>



                                    </div>
                                  </div>


                                </React.Fragment>
                              )

                            })}

                          </div>


                        </div>
                      </div>
                    </div>

                  </React.Fragment>
                );
              })
            }
            {JSON.stringify(this.state)}
            {this.state.totalParent > 0 ? (<button name="submit">Submit</button>) : (<div></div>)}
              </div>
            </div>
            
          </div>
        </div>


      </React.Fragment>
    );
  }
}