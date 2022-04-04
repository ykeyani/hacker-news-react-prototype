import React from "react";

export type ErrorComponentProps = {
    message: string
}

export default function ErrorComponent(props: ErrorComponentProps) {
    return (
        <div className={"error"}>
            Something went wrong ¯\_(ツ)_/¯
            <p>{props.message}</p>
        </div>
    )
}