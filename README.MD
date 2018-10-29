CISC 7412
HW 1

Author: Assel Omarova

You are to write a program which solves the 8 puzzle using A\* search.
The program should input a puzzle and output the solution sequence.
In addition to keeping the OPEN and CLOSED node lists, one should think of
how to represent the search tree. I recommend using parent pointers.
This way when you find a solution you can follow the nodes (positions) back to the Start.
Then you print out this sequence in reverse, by using a stack, reversing pointers,
or even storing them in an array.

From the initial state of a random integers from 1 to 8 expect:

1 2 3
4 5 6
7 8

---

This project is implemented on node.js.
To run it, need to install in the terminal:
$ npm i node

To run the program, inside of src folder run:
$node index.js
