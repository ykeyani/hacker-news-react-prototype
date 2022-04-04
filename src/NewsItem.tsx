import React from "react";
import {fetchAllComments, HackerItem, timeSinceString} from "./common";
import MetaItem from "./MetaItem";
import ErrorComponent from "./ErrorComponent";

type NewsItemProps = {
    hackerItem: HackerItem
}

type NewsItemState = {
    comments: HackerItem[],
    loading: boolean,
    error?: string
}

export default class NewsItem extends React.Component<NewsItemProps, NewsItemState> {
    constructor(props: Readonly<NewsItemProps> | NewsItemProps) {
        super(props);

        this.state = {
            comments: [],
            loading: true
        }
    }

    componentDidMount() {
        fetchAllComments(this.props.hackerItem, 3).then(comments => this.setState({
            comments,
            loading: false
        })).catch(error => this.setState({
                error: error.message
            })
        )
    }

    recursiveComments(comments: HackerItem[]) {
        return (
            <React.Fragment>
                {comments.map(comment =>
                    <div className={"comment"} key={comment.id}>
                        <span>{comment.by} {timeSinceString(comment.time)}</span>
                        <MetaItem hackerItem={comment} />
                        {/*todo: sanitise html first*/}
                        <p dangerouslySetInnerHTML={{__html: comment.text}} />
                        {comment.children && this.recursiveComments(comment.children)}
                    </div>
                )}
            </React.Fragment>
        )
    }

    render() {
        if (this.state.error) {
            return (
                <ErrorComponent message={this.state.error} />
            )
        }

        return (
            <div className={"news-item"}>
                {this.state.loading &&
                    <div className={"stage"}>
                        <div className={"dot-falling"} />
                    </div>
                }
                {this.recursiveComments(this.state.comments)}
            </div>
        )
    }
}