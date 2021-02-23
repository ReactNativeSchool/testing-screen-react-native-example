import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";

import SignIn from "../SignIn";

const flushMicrotasksQueue = () =>
  new Promise((resolve) => setImmediate(resolve));

it("renders default elements", () => {
  const { getAllByText, getByPlaceholderText } = render(<SignIn />);

  expect(getAllByText("Login").length).toBe(2);
  getByPlaceholderText("example");
  getByPlaceholderText("***");
});

it("shows invalid input messages", () => {
  const { getByTestId, getByText } = render(<SignIn />);

  fireEvent.press(getByTestId("SignIn.Button"));

  getByText("Invalid username.");
  getByText("Invalid password.");
});

it("shows invalid user name error message", () => {
  const { getByTestId, getByText, queryAllByText } = render(<SignIn />);

  fireEvent.changeText(getByTestId("SignIn.passwordInput"), "asdf");

  fireEvent.press(getByTestId("SignIn.Button"));

  getByText("Invalid username.");
  expect(queryAllByText("Invalid password.").length).toBe(0);

  fireEvent.changeText(getByTestId("SignIn.usernameInput"), "invalid input");

  getByText("Invalid username.");
  expect(queryAllByText("Invalid password.").length).toBe(0);
});

it("shows invalid password error message", () => {
  const { getByTestId, getByText, queryAllByText } = render(<SignIn />);

  fireEvent.changeText(getByTestId("SignIn.usernameInput"), "example");

  fireEvent.press(getByTestId("SignIn.Button"));

  getByText("Invalid password.");
  expect(queryAllByText("Invalid username.").length).toBe(0);

  fireEvent.changeText(getByTestId("SignIn.passwordInput"), "invalid input");

  getByText("Invalid password.");
  expect(queryAllByText("Invalid username.").length).toBe(0);
});

it("handles valid input submission", async () => {
  fetch.mockResponseOnce(JSON.stringify({ passes: true }));

  const pushMock = jest.fn();
  const { getByTestId } = render(<SignIn navigation={{ push: pushMock }} />);

  fireEvent.changeText(getByTestId("SignIn.usernameInput"), "example");
  fireEvent.changeText(getByTestId("SignIn.passwordInput"), "asdf");
  fireEvent.press(getByTestId("SignIn.Button"));

  expect(fetch.mock.calls).toMatchSnapshot();
  await act(flushMicrotasksQueue);

  expect(pushMock).toBeCalledWith("App");
});
