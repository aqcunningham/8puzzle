CISC 7412

HW 1

Student: Aselle Cunningham

<!-- You are to write a program which solves the 8 puzzle using A\* search.
The program should input a puzzle and output the solution sequence.
In addition to keeping the OPEN and CLOSED node lists, one should think of
how to represent the search tree. I recommend using parent pointers.
This way when you find a solution you can follow the nodes (positions) back to the Start.
Then you print out this sequence in reverse, by using a stack, reversing pointers,
or even storing them in an array. -->

From the initial state to:

0 1 2
3 4 5
6 7 8

---

This project is implemented on JS with some HTML for the interface.
In order to run it, open index.html in the browser.

Instructions:

    In the given 3x3 grid a user can try moving slides to solve it. The cost of the steps is accumulated, the steps taken are written in Solution.

    Another way, to click Solve to receive the solution right away (might take some time). Also, the cost of steps is accumulated and the path of the solution is printed in Solution.
