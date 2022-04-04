import React from "react";
import {fetchStories, NewsListItem, timeSinceString} from "./common";
import NewsItem from "./NewsItem";
import MetaItem from "./MetaItem";
import ErrorComponent from "./ErrorComponent";

type NewsListState = {
    newsItems: NewsListItem[],
    loading: boolean
    error?: string
}

export default class NewsList extends React.Component<any, NewsListState> {
    constructor(props: any) {
        super(props);

        this.state = {
            newsItems: [],
            loading: true,
            error: undefined
        }
    }

    refresh() {
        fetchStories(10)
            .then(stories => stories.map(story => ({
                hackerItem: story,
                expanded: false
            }))
        )
            .then(newsItems => this.setState({
                newsItems,
                loading: false
            }))
            .catch(error => this.setState({
                error: error.message
            }))
    }

    toggleExpand(index: number) {
        let newsItems = this.state.newsItems;
        newsItems[index].expanded = !newsItems[index].expanded;
        this.setState({
            newsItems
        })
    }

    componentDidMount() {
        this.refresh();
    }

    render() {
        let unixTime = Date.now()/1000;

        if (this.state.error) {
            return (
                <ErrorComponent message={this.state.error} />
            )
        }

        return (
            <div className={"news-list"}>
                {this.state.loading &&
                    <div className={"stage"}>
                        <div className={"dot-falling"} />
                    </div>
                }

                {this.state.newsItems.map((newsItem, index) =>
                    <article key={index} onClick={(e) => this.toggleExpand(index)}>
                        <summary>
                            <h2 className={"summary-title"}>
                                <span className={"index"}>{index+1}.</span>
                                {newsItem.hackerItem.url &&
                                    <a href={newsItem.hackerItem.url} target={"_blank"} rel="noreferrer">
                                        <span className={"title"}>{newsItem.hackerItem.title}</span>
                                        <span className={"link"}>({(new URL(newsItem.hackerItem.url)).hostname})</span>
                                    </a>
                                }
                            </h2>
                            <div className={"summary-text"}>
                                <span className={"col-sm-12"}>{newsItem.hackerItem.score} points by {newsItem.hackerItem.by} {timeSinceString(newsItem.hackerItem.time, unixTime)} | <span className={"comments-link"}>{newsItem.hackerItem.descendants} comments</span></span>
                                <MetaItem hackerItem={newsItem.hackerItem} />
                            </div>
                        </summary>
                        {newsItem.expanded &&
                            <NewsItem hackerItem={newsItem.hackerItem} />
                        }
                    </article>
                )}
            </div>
        )
    }
}