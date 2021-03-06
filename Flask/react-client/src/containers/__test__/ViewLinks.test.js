/*
Most tests work but need to fix the moxios issue; it works with .js but .ts not working

Potential Problems:
- Root.ts

*/
import React from "react";
import { mount } from "enzyme";
import moxios from "moxios";

import Root from "../../Root";
import ViewLinks from "../ViewLinks";

describe("<ViewLinks /> Test", () => {
  let wrapper;

  const initialState = {
    AllLinks: {
      links: []
    },
    Auth: {
      userId: "65ce5dad-85df-4355-94f5-2669d8fce4de"
    }
  };

  beforeEach(() => {
    moxios.install();

    wrapper = mount(
      <Root initialState={initialState}>
        <ViewLinks />
      </Root>
    );
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it("should shows seven links", done => {
    moxios.stubRequest(
      "http://localhost:3001/api/links/65ce5dad-85df-4355-94f5-2669d8fce4de/",
      {
        status: 200,
        response: [
          {
            analytics: [
              {
                date: "8/6/2019",
                clicks: 2
              }
            ],
            id: "5d6f07ad8e3b312e8c06b07f",
            redirectId: "1a451bb3-cb6a-46c6-8761-fb6636089a6c",
            redirectURL:
              "http://localhost:3001/redirect/1a451bb3-cb6a-46c6-8761-fb6636089a6c",
            userId: "65ce5dad-85df-4355-94f5-2669d8fce4de",
            link: "https://mongoosejs.com/",
            title: "Mongoose",
            date: "Wed, 04 Sep 2019 00:39:09 GMT",
            links: [],
            __v: 0
          },
          {
            analytics: [
              {
                date: "8/1/2019",
                clicks: 1
              }
            ],
            id: "5d6f07c48e3b312e8c06b080",
            redirectId: "55f08ecc-8fe6-4e9b-9c04-6b48b670e5b8",
            redirectURL:
              "http://localhost:3001/redirect/55f08ecc-8fe6-4e9b-9c04-6b48b670e5b8",
            userId: "65ce5dad-85df-4355-94f5-2669d8fce4de",
            link: "https://nodejs.org/en/",
            title: "Node",
            date: "Wed, 04 Sep 2019 00:39:32 GMT",
            links: [],
            __v: 0
          },
          {
            analytics: [],
            id: "5d6f0a3cd5020f2fff2239f3",
            redirectId: "90668bb1-ffab-459e-aa0f-eeeb299127db",
            redirectURL:
              "http://localhost:3001/redirect/90668bb1-ffab-459e-aa0f-eeeb299127db",
            userId: "65ce5dad-85df-4355-94f5-2669d8fce4de",
            link: "https://www.python.org/",
            title: "Python",
            date: "Wed, 04 Sep 2019 00:50:04 GMT",
            __v: 0
          },
          {
            analytics: [],
            id: "5d72191da0a41e24dcb1bb53",
            redirectId: "c19b98bb-622d-4f7c-8910-cc83cee70c6d",
            redirectURL:
              "http://localhost:3001/redirect/c19b98bb-622d-4f7c-8910-cc83cee70c6d",
            userId: "65ce5dad-85df-4355-94f5-2669d8fce4de",
            link: "https://www.ruby-lang.org/en/",
            title: "Ruby",
            date: "Fri, 06 Sep 2019 08:30:21 GMT",
            __v: 0
          },
          {
            analytics: [],
            id: "5d721991a0a41e24dcb1bb54",
            redirectId: "af7d2125-1fd7-4a5f-b0fd-959d6f4a02fe",
            redirectURL:
              "http://localhost:3001/redirect/af7d2125-1fd7-4a5f-b0fd-959d6f4a02fe",
            userId: "65ce5dad-85df-4355-94f5-2669d8fce4de",
            link: "https://www.php.net/",
            title: "PHP",
            date: "Fri, 06 Sep 2019 08:32:16 GMT",
            __v: 0
          },
          {
            analytics: [
              {
                date: "8/1/2019",
                clicks: 1
              }
            ],
            id: "5d7219f5a0a41e24dcb1bb55",
            redirectId: "36f6ad6b-1fff-46a2-be85-6a78c737f0a6",
            redirectURL:
              "http://localhost:3001/redirect/36f6ad6b-1fff-46a2-be85-6a78c737f0a6",
            userId: "65ce5dad-85df-4355-94f5-2669d8fce4de",
            link: "https://golang.org/",
            title: "GO",
            date: "Fri, 06 Sep 2019 08:33:57 GMT",
            __v: 0
          },
          {
            analytics: [],
            id: "5d74c9b91e389d45951aced9",
            redirectId: "2059fa03-2f11-4db7-9c82-17c189360e57",
            redirectURL:
              "http://localhost:3001/redirect/2059fa03-2f11-4db7-9c82-17c189360e57",
            userId: "65ce5dad-85df-4355-94f5-2669d8fce4de",
            link: "https://www.rust-lang.org",
            title: "Rust",
            date: "Sun, 08 Sep 2019 09:28:25 GMT",
            __v: 0
          }
        ]
      }
    );

    moxios.wait(() => {
      wrapper.update();

      expect(wrapper.find("div.list-group-item").length).toEqual(9);

      done();

      wrapper.unmount();
    });
  });
});
