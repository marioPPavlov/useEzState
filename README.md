# **useEzState**✨ 

useEzState is a custom React hook and a simple way to solve *"React.useState hell"*.  
It sits somewhere between *useState* and *useReducer* and excels when you have multiple state variables inside the same component. Intended to be used with typescript in order to achieve typesafe state updates.

## Installation and Usage:

```shell
npm i use-ez-state
```

Much like *React.useState* the custom hook *useEzState* accepts an initial state parameter - with the difference that it always has to be an object. It then returns the current state and an update function as a tuple - *[state, update]*

```typescript
import useEzState from "use-ez-state"

const [{name, age}, update] = useEzState({ name: 'John', age: 32 });

update({ name: 'Jack' });
console.log(name); // Jack
console.log(age); // 32
```
```typescript
// You can also update multiple state variables
update({ name: 'Jill', age: 21 });
console.log(name); // Jill
console.log(age); // 21
```
The type of the state is inferred from the initial state and the update function accepts an object containing a subtype of the state and only those properties will be updated in the state. 

You can play around with *useEzState* on *[StackBlitz ](https://stackblitz.com/edit/react-ts-7ewjfr?file=App.tsx)*

## When to use useEzState

useEzStates starts scaling once you have more than 2 usages of useState:

```typescript
const [email, setEmail] =  React.useState("");
const [userName, setUserName] =  React.useState("");
const [password1, setPassword1] =  React.useState("");
const [password2, setPassword2] =  React.useState("");
```
can be changed to:

```typescript
const [{ email, userName, password1, password2 }, update] =  useEzState({
  email: "",
  userName: "",
  password1: "",
  password2: "",
});
```
The benefit of using *useEzState* is that your state structure now resembles a plain javascript object and you have to deal with only one typesafe update function.

## Advanced tips:

* By default, typescript does not differentiate between *missing* a value and setting this value as *undefined* and thus using `update({email: undefined})` will not result in an error, even though it should, since we've stated that email should be only of type string. Adding the following flag `"exactOptionalPropertyTypes": true` in your `tsconfig.json` resolves this issue. Now `update({email: undefined})` results in a type error. You can find out more about the `exactOptionalPropertyTypes` in *[Typescript 4.4 release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#exact-optional-property-types)*

* useEzState accepts a second optional parameter - a reducer function (just like useReducer). The default implementation is `(state, next) => ({...state, ...next})` which just simply merges the state with the partial update value. You can add your own reducer in order to add centralized custom logic to your state updates  - parsing, validation etc.