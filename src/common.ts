/**
 * takes two unix time numbers and returns a string saying ~ how long the duration is
 * @param since the start of the duration
 * @param to the current duration (defaults to the current time)
 */
export function timeSinceString(since: number, to?: number): string {
    if (!to) to = Date.now() / 1000;
    let seconds = to - since;

    if (seconds < 60) {
        return "just now"
    }
    if (seconds < 3600) {
        let minutes = Math.floor(seconds/60);
        return `${minutes} minute${minutes>1 ? "s" : ""} ago`
    }
    if (seconds < 3600*24) {
        let hours = Math.floor(seconds/3600);
        return `${hours} hour${hours>1 ? "s" : ""} ago`
    }
    let days = Math.floor(seconds/(3600*24));
    return `${days} day${days>1 ? "s" : ""} ago`
}

// generic type representing objects returned by the API with an added children field for nested items i.e comments
export type HackerItem = {
    id: number,
    deleted?: boolean,
    type: string,
    by: string,
    time: number,
    text: string,
    dead?: boolean,
    parent?: number,
    poll?: null,
    kids?: number[],
    url?: string,
    score?: number,
    title?: string,
    parts?: number[],
    descendants?: number,
    children?: HackerItem[]
}

// container showing if an item is "expanded"
export type NewsListItem = {
    hackerItem: HackerItem,
    expanded: boolean
}

const BASE_ENDPOINT = "https://hacker-news.firebaseio.com/v0/";

/**
 * fetches resources from the API
 * @param uri the relative URI/endpoint to fetch
 */
function baseFetch(uri : string) {
    let url = `${BASE_ENDPOINT}${uri}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`failed to fetch: ${url}`)
            }
            return response.json()
        })
}

/**
 * fetches resources by an items id
 * @param itemId
 */
export function fetchItem(itemId: number) {
    return baseFetch(`item/${itemId}.json`)
}

/**
 * fetches the top stories
 * @param limit limit the number of stories to fetch
 */
export function fetchStories(limit: number) {
    return baseFetch("topstories.json")
        .then(stories =>
            Promise.all(stories.slice(0,limit).map((storyId: number) =>
                fetchItem(storyId))
            )
        )
}

/**
 * fetches comments on an item which could be a story or comment
 * @param hackerItem
 * @param limit limits the number of comments to fetch
 */
function fetchComments(hackerItem: HackerItem, limit:number) {
    if (hackerItem.kids && hackerItem.kids.length > 0)
        return Promise.all(hackerItem.kids.slice(0, limit).map((itemId: number) =>
            fetchItem(itemId).then(comment => {
                if (!comment) throw new Error("Comment failed to fetch.")
                if (comment.type !== "comment") throw new Error("Fetched something that wasn't a comment")

                return comment
            })
        ))

    return Promise.resolve([]);
}

/**
 * Walk through API items and build a tree of comments
 * @param story the story to find comments in
 * @param limit limit the number of comments to fetch
 * @param requestNumber the number of async request to make at once
 *
 * @return {HackerItem[]}
 */
export async function fetchAllComments(story: HackerItem, limit: number, requestNumber: number = 10) {
    // A queue to control the next batch of items to process and avoid recursion.
    let fetchQueue: HackerItem[] = [story]
    let allComments: HackerItem[] = [];

    let loopIndex = 0;
    while (fetchQueue.length > 0) {
        let requestQueue = fetchQueue.splice(0, requestNumber);
        let comments = await Promise.all(requestQueue.map(item => fetchComments(item, limit).then(comments => {
            if (item.type === "comment") {
                item.children = comments as HackerItem[];
            }
            return comments;
        })))

        let commentItems = comments as HackerItem[][];

        // the first time through the loop make the comments the return value as other comments will be nested within.
        if (loopIndex === 0) {
            allComments = commentItems[0];
        }

        loopIndex++;

        for (let i=0; i<commentItems.length; i++) {
            let subComments = commentItems[i];
            fetchQueue.push(...subComments);
        }
    }

    return allComments;
}