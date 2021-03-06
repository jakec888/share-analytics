import React from "react";
import { mount } from "enzyme";

import Root from "../../Root";
import CreateLink from "../CreateLink";

describe("<CreateLink /> Test", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Root>
        <CreateLink />
      </Root>
    );
  });

  it("shows one form", () => {
    expect(wrapper.find("form").length).toEqual(1);
  });

  it("shows two inputs", () => {
    expect(wrapper.find("input").length).toEqual(2);
  });

  it("shows one form button", () => {
    expect(wrapper.find("button").length).toEqual(1);
  });

  it("button should have proper text", () => {
    expect(wrapper.find("button").text()).toEqual("Submit");
  });
});
