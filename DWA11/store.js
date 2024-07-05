import { reducer } from "./reducers.js"

/**
 * @typedef {object} State
 * @prop {'idle' | 'adding'} phase
 * @prop {object} filters
 * @prop {object} tasks
 */

const initialState = {
    count: 0 
};

const states = [initialState];

/**
 * @type {Array<Subscription>}
 */
let subscribers = [];

/**
 * @callback GetState
 * @returns {State}
 */

export const getState = () => {
    return Object.freeze({...states[0] });
};

/**
 * @callback Dispatch
 * @param {Action} action 
 */

export const dispatch = (action) => {
    const prev = getState();
    const next = reducer(prev, action)
    states.unshift(next);
    subscribers.forEach(subscribe => subscribe(prev, next));
};

/**
 * @callback EmptyFn
 */

/**
 * @callback Subscription 
 * @param {State} prev
 * @param {State} next
 */

/**
 * @typedef {object} Store
 * @prop {GetState} getState 
 * @prop {Subscription} subscribe
 * @prop {Dispatch} dispatch
 */


/**
 * @param {Subscription} subscription
 */
export const subscribe = (subscription) => {
    subscribers.push(subscription)
    const handler = (item) => item !== subscription

    const unsubscribe = () => {
        const newSubscribers = subscribers.filter(handler);
        subscribers = newSubscribers;
    };

    return unsubscribe;
};
