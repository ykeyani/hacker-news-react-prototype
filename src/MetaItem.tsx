import React from "react";
import {HackerItem} from "./common";

type MetaItemProps = {
    hackerItem: HackerItem
}

export default function MetaItem (props: MetaItemProps) {
    return (
        <div className={"meta-item"}>
            <p>meta info</p>
            <div>
                <span>id: {props.hackerItem.id}</span>
                <span>type: {props.hackerItem.type}</span>
                <span>time: {props.hackerItem.time}</span>
                {props.hackerItem.deleted &&
                    <span>deleted: {props.hackerItem.deleted}</span>
                }
                {props.hackerItem.dead &&
                    <span>dead: {props.hackerItem.dead}</span>
                }
                {props.hackerItem.parent &&
                    <span>parent: {props.hackerItem.parent}</span>
                }
                {props.hackerItem.poll &&
                    <span>poll: {props.hackerItem.poll}</span>
                }
                {props.hackerItem.kids &&
                    <span>kids: {props.hackerItem.kids.map((kid, index) =>
                        <i key={index}>{kid}, </i>
                    )}</span>
                }
                {props.hackerItem.url &&
                    <span>url: {props.hackerItem.url}</span>
                }
                {props.hackerItem.parts &&
                    <span>parts: {props.hackerItem.parts}</span>
                }
            </div>
        </div>

    )
}