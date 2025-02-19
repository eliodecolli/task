# Demo Practice Project - "task"
 Once I joined GrapeCity, I didn't have much experience (if any at all) in TypeScript or front-end development. Since those guys there actually build UI components, based on vanilla JS/TS, they thought it'd be a good idea to assign me this type of exercise project to get accustomed to TS and a bit of front end too.

## Description
 The main idea here is to build an expression evaluator, which consists of two components:
 1. An input textbox inside which you can write your mathematical expression, ie "(2+5)*(10 - (3 / .05))".
 2. A read-only textbox, which will be populated with the result of the expression.

## Implementation
 The logic behind evaluating the expression is similar to that in compilers up to a certain point (and if compilers were dumb). I initially generate a bunch of nodes (tokens) from the input expression, ie `2+2`:

`node: [2, number]`, `node: [+, operator]`, and `node: [2, number]`.

Each node has a method `evaluate()` which does essentially what the name implies:
 1. On nodes of type `number`, it returns the number itself.
 2. On nodes of type `operator`, it applies the given operator to its children nodes.

After generating the nodes, we arrange them in a reverse polish notation, ie `2 + 2` -> `2 2 +`, using the [Shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm). The next step is to compile an expression tree by reading the nodes one by one:
 ```
    +
  /   \
 2     2
 ```

Finally, calling the root of this tree's `evaluate()` method, will trigger a recursive call along each branch of the tree (remember, operator nodes call their children's `evaluate()` as well), thus producing the final output.

The rest is pretty straightforward.

