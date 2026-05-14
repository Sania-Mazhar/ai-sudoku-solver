# Sudoku CSP Solver - Viva Preparation Guide

Ye guide aapko viva mein project explain karne aur potential sawalat ke jawab dene mein madad karegi.

---

## 1. Project Overview
Is project mein humne ek **Sudoku Solver** banaya hai jo **Artificial Intelligence (AI)** ki ek technique **Constraint Satisfaction Problem (CSP)** par mabni hai. Ye solver sirf simple backtracking nahi karta balki efficient algorithms (AC-3 aur Forward Checking) use karta hai.

## 2. Core Concepts (Jo aapko pata hone chahiye)

### CSP (Constraint Satisfaction Problem) kia hai?
Sudoku ko hum CSP ke taur par dekhte hain kyunke ismein 3 cheezein hoti hain:
1. **Variables**: 81 cells (9x9 grid).
2. **Domains**: Har cell ki possible values (1 se 9 tak).
3. **Constraints**: Rules (Row, Column, aur 3x3 Box mein koi number repeat nahi hona chahiye).

### Algorithms jo humne use kiye:

1. **AC-3 (Arc Consistency Algorithm #3)**:
   - Ye algorithm **preprocessing** ke liye use hota hai. 
   - Ye har cell ke neighbors ko check karta hai aur agar kisi cell ki domain mein aisi value ho jo rules ke khilaf ho, toh use remove kar deta hai.
   - **Fayda**: Isse search space shuru mein hi chota ho jata hai.

2. **Backtracking Search**:
   - Ye ek depth-first search hai jo har empty cell mein ek value try karta hai. 
   - Agar aage ja kar solution nahi milta, toh ye piche (backtrack) aata hai aur dusri value try karta hai.

3. **Forward Checking**:
   - Jab hum kisi cell ko koi value assign karte hain, toh Forward Checking uske neighbors ki domains se wo value fauran hata deta hai.
   - **Fayda**: Isse humein pehle hi pata chal jata hai ke koi aage ja kar fail toh nahi hoga.

4. **MRV Heuristic (Minimum Remaining Values)**:
   - Hum wo cell pehle select karte hain jiski domain mein sab se kam options (values) bachi hon.
   - Isse "fail-first" principle apply hota hai, jiski wajah se solver bohot fast chalta hai.

---

## 3. Potential Viva Questions & Answers

**Q1: Aapne AC-3 kyun use kiya?**
*Answer*: AC-3 domains ko restrict karne ke liye behtareen hai. Isse humein search shuru karne se pehle hi pata chal jata hai ke kaunsi values bilkul nahi aa saktin, jis se algorithm ka time bachta hai.

**Q2: Forward Checking aur Backtracking mein kia farq hai?**
*Answer*: Backtracking sirf values try karta hai, jabke Forward Checking value assign karte hi uske asraat (impact) ko neighbors par check karta hai taake invalid paths par time waste na ho.

**Q3: Agar Sudoku unsolvable ho toh aapka program kia karega?**
*Answer*: Program "No solution found" return karega. Mere project mein Medium aur Very Hard boards mein visual inconsistencies thi (duplicate numbers), toh solver ne fauran identify kar liya ke ye puzzle invalid hai.

**Q4: MRV heuristic ka kia kaam hai?**
*Answer*: MRV humein batata hai ke "kaunsa variable pehle choose karna chahiye". Hum wo cell uthate hain jiske pass options kam hon, taake search tree chota rahe.

---

## 4. Code Structure (Explain karne ke liye)
- **`SudokuCSP` Class**: Ismein variables, domains aur neighbors initialize hote hain.
- **`ac3()` method**: Consistency check karne ke liye.
- **`backtrack()` function**: Main recursive function jo solution dhoondta hai.
- **`isConsistent()`**: Check karta hai ke kya naya value Sudoku ke rules ko follow kar raha hai.

---

## 5. Summary (For the Teacher)
"Sir/Ma'am, maine ek Sudoku solver implement kiya hai jo CSP paradigm use karta hai. Ismein AC-3 constraint propagation ke liye hai, aur backtracking search optimized hai Forward Checking aur MRV heuristic ke saath, taake hard puzzles bhi seconds mein solve ho saken."
