import sys

class SudokuCSP:
    def __init__(self, board_str):
        """
        board_str: A string representing the board (9 lines of 9 digits)
        """
        self.variables = [(r, c) for r in range(9) for c in range(9)]
        self.domains = {}
        self.constraints = {}
        
        # Parse board and initialize domains
        board = [list(line.strip()) for line in board_str.strip().split('\n')]
        for r in range(9):
            for c in range(9):
                val = int(board[r][c])
                if val != 0:
                    self.domains[(r, c)] = [val]
                else:
                    self.domains[(r, c)] = list(range(1, 10))
        
        # Define neighbors for each cell
        self.neighbors = {v: set() for v in self.variables}
        for r, c in self.variables:
            # Row and column neighbors
            for i in range(9):
                if i != c: self.neighbors[(r, c)].add((r, i))
                if i != r: self.neighbors[(r, c)].add((i, c))
            # 3x3 Box neighbors
            br, bc = (r // 3) * 3, (c // 3) * 3
            for i in range(br, br + 3):
                for j in range(bc, bc + 3):
                    if (i, j) != (r, c):
                        self.neighbors[(r, c)].add((i, j))

    def is_consistent(self, var, value, assignment):
        for neighbor in self.neighbors[var]:
            if neighbor in assignment and assignment[neighbor] == value:
                return False
        return True

    def ac3(self):
        queue = []
        for v in self.variables:
            for n in self.neighbors[v]:
                queue.append((v, n))
        
        while queue:
            (xi, xj) = queue.pop(0)
            if self.revise(xi, xj):
                if not self.domains[xi]:
                    return False
                for xk in self.neighbors[xi]:
                    if xk != xj:
                        queue.append((xk, xi))
        return True

    def revise(self, xi, xj):
        revised = False
        for x in self.domains[xi][:]:
            # If no value in Dj allows (x, y) to satisfy constraint
            if not any(x != y for y in self.domains[xj]):
                self.domains[xi].remove(x)
                revised = True
        return revised

def solve_sudoku(filename):
    with open(filename, 'r') as f:
        board_str = f.read()
    
    csp = SudokuCSP(board_str)
    
    # Pre-processing with AC-3
    if not csp.ac3():
        return None
    
    # Backtracking Search
    assignment = {}
    for var, domain in csp.domains.items():
        if len(domain) == 1:
            assignment[var] = domain[0]
            
    solution = backtrack(assignment, csp)
    return solution

def backtrack(assignment, csp):
    if len(assignment) == len(csp.variables):
        return assignment
    
    # MRV Heuristic: Choose variable with minimum remaining values
    unassigned = [v for v in csp.variables if v not in assignment]
    var = min(unassigned, key=lambda v: len(csp.domains[v]))
    
    for value in csp.domains[var]:
        if csp.is_consistent(var, value, assignment):
            assignment[var] = value
            
            # Forward Checking
            removals = []
            consistent = True
            for neighbor in csp.neighbors[var]:
                if neighbor not in assignment:
                    if value in csp.domains[neighbor]:
                        csp.domains[neighbor].remove(value)
                        removals.append((neighbor, value))
                        if not csp.domains[neighbor]:
                            consistent = False
                            break
            
            if consistent:
                result = backtrack(assignment, csp)
                if result:
                    return result
            
            # Backtrack
            for n, v in removals:
                csp.domains[n].append(v)
            del assignment[var]
            
    return None

def print_board(solution):
    if not solution:
        print("No solution found.")
        return
    for r in range(9):
        line = ""
        for c in range(9):
            line += str(solution[(r, c)])
        print(line)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python sudoku_solver.py <filename>")
    else:
        sol = solve_sudoku(sys.argv[1])
        print_board(sol)
