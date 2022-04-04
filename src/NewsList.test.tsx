import React from "react";
import {render, screen} from '@testing-library/react';
import NewsList from "./NewsList";

test('loads 10 things from hacker news', async () => {
    render(<NewsList />)
    await screen.findAllByRole('article').then(articles => expect(articles.length).toBe(10));
})