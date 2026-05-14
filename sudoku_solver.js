const fs = require('fs');

class SudokuCSP {
    constructor(boardStr) {
        this.variables = [];
        this.domains = new Map();
        this.neighbors = new Map();

        const rows = boardStr.trim().split(/\r?\n/);
        const board = rows.map(row => row.trim().split('').map(Number));

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const varName = `${r},${c}`;
                this.variables.push(varName);
                if (board[r][c] !== 0) {
                    this.domains.set(varName, [board[r][c]]);
                } else {
                    this.domains.set(varName, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
                }
                this.neighbors.set(varName, new Set());
            }
        }

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const curr = `${r},${c}`;
                const neighbors = this.neighbors.get(curr);
                
                // Row and Column
                for (let i = 0; i < 9; i++) {
                    if (i !== c) neighbors.add(`${r},${i}`);
                    if (i !== r) neighbors.add(`${i},${c}`);
                }
                
                // Box
                const br = Math.floor(r / 3) * 3;
                const bc = Math.floor(c / 3) * 3;
                for (let i = br; i < br + 3; i++) {
                    for (let j = bc; j < bc + 3; j++) {
                        if (i !== r || j !== c) {
                            neighbors.add(`${i},${j}`);
                        }
                    }
                }
            }
        }
    }

    isConsistent(varName, value, assignment) {
        for (const neighbor of this.neighbors.get(varName)) {
            if (assignment.has(neighbor) && assignment.get(neighbor) === value) {
                return false;
            }
        }
        return true;
    }

    ac3() {
        const queue = [];
        for (const xi of this.variables) {
            for (const xj of this.neighbors.get(xi)) {
                queue.push([xi, xj]);
            }
        }

        while (queue.length > 0) {
            const [xi, xj] = queue.shift();
            if (this.revise(xi, xj)) {
                if (this.domains.get(xi).length === 0) return false;
                for (const xk of this.neighbors.get(xi)) {
                    if (xk !== xj) {
                        queue.push([xk, xi]);
                    }
                }
            }
        }
        return true;
    }

    revise(xi, xj) {
        let revised = false;
        const di = this.domains.get(xi);
        const dj = this.domains.get(xj);
        
        for (let i = di.length - 1; i >= 0; i--) {
            const x = di[i];
            const hasSupport = dj.some(y => x !== y);
            if (!hasSupport) {
                di.splice(i, 1);
                revised = true;
            }
        }
        return revised;
    }
}

function solve(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    const csp = new SudokuCSP(data);

    if (!csp.ac3()) return null;

    const assignment = new Map();
    for (const [varName, domain] of csp.domains) {
        if (domain.length === 1) {
            assignment.set(varName, domain[0]);
        }
    }

    return backtrack(assignment, csp);
}

function backtrack(assignment, csp) {
    if (assignment.size === csp.variables.length) {
        return assignment;
    }

    const unassigned = csp.variables.filter(v => !assignment.has(v));
    // MRV Heuristic
    const varName = unassigned.reduce((min, v) => 
        csp.domains.get(v).length < csp.domains.get(min).length ? v : min, unassigned[0]);

    for (const value of csp.domains.get(varName)) {
        if (csp.isConsistent(varName, value, assignment)) {
            assignment.set(varName, value);
            
            const removals = [];
            let consistent = true;
            
            // Forward Checking
            for (const neighbor of csp.neighbors.get(varName)) {
                if (!assignment.has(neighbor)) {
                    const domain = csp.domains.get(neighbor);
                    const index = domain.indexOf(value);
                    if (index !== -1) {
                        domain.splice(index, 1);
                        removals.push([neighbor, value]);
                        if (domain.length === 0) {
                            consistent = false;
                            break;
                        }
                    }
                }
            }

            if (consistent) {
                const result = backtrack(assignment, csp);
                if (result) return result;
            }

            // Restore
            for (const [n, v] of removals) {
                csp.domains.get(n).push(v);
            }
            assignment.delete(varName);
        }
    }
    return null;
}

function printBoard(assignment) {
    if (!assignment) {
        console.log("No solution found.");
        return;
    }
    for (let r = 0; r < 9; r++) {
        let line = "";
        for (let c = 0; c < 9; c++) {
            line += assignment.get(`${r},${c}`);
        }
        console.log(line);
    }
}

const args = process.argv.slice(2);
if (args.length > 0) {
    const sol = solve(args[0]);
    printBoard(sol);
}
