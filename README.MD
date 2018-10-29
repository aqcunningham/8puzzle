CISC 7412
HW 1

Student: Assel Omarova

You are to write a program which solves the 8 puzzle using A\* search.
The program should input a puzzle and output the solution sequence.
In addition to keeping the OPEN and CLOSED node lists, one should think of
how to represent the search tree. I recommend using parent pointers.
This way when you find a solution you can follow the nodes (positions) back to the Start.
Then you print out this sequence in reverse, by using a stack, reversing pointers,
or even storing them in an array.

From the initial state of a random integers from 1 to 8 expect:

0 1 2
3 4 5
6 7 8

---

This project is implemented on JS with some HTML for the interface.
In order to run it, open index.html in the browser.

Instructions:

    In the 3x3 given grid a user can try playing it to solve. On each step, the cost of the step is accumulated, as well as the steps in the Solution, until it's solved.

    Another way, to click Solve to receive the solution right away (from the current postition).
