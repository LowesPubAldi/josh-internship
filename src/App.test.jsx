import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./pages/Home", () => () => <h1>Home</h1>);
jest.mock("./pages/Explore", () => () => <h1>Explore</h1>);
jest.mock("./pages/Author", () => () => <h1>Author</h1>);
jest.mock("./pages/ItemDetails", () => () => <h1>Item Details</h1>);

jest.mock("aos", () => ({
  init: jest.fn(),
}));

describe("App smoke tests", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it("renders core navigation links", () => {
    render(<App />);

    expect(screen.getAllByText(/explore/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /connect wallet/i }).length).toBeGreaterThan(0);
  });

  it("redirects /item-details to explore", () => {
    window.history.pushState({}, "Test", "/item-details");

    render(<App />);

    expect(screen.getByRole("heading", { name: /explore/i })).toBeTruthy();
  });
});
