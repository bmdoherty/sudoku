[![Build Status](https://travis-ci.org/bmdoherty/sudoku.svg?branch=master)](https://travis-ci.org/bmdoherty/sudoku)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

### Sudoku engine
Small side project in javascript, written in es2017, build will produce an es5 .js file, which can be used as a dependancy in other projects

### Run
````
npm install
npm test
npm run build 
````

### Demo
engine + react [on github pages](https://bmdoherty.github.io/sudoku-react/)

[Guardian hard Nov 30](https://bmdoherty.github.io/sudoku-react/#040008000000000462500609370407000000090000020000000107082306004739000000000700030)

[Guardian medium Nov 29](https://bmdoherty.github.io/sudoku-react/#700800400300270001009063000002700069000000000190006200000510300600087004001009005)

[HiddenSingle, NakedSingle - Guardian hard Oct 13](https://bmdoherty.github.io/sudoku-react/#000000000007020400008504900009000800510080027000203000000000000435000196180000054)

[HiddenSingle, NakedSingle - Guardian hard Oct 12](https://bmdoherty.github.io/sudoku-react/#000000003089000060060078000000030006004500290006000014000020001070085000500403800)

[Naked Double](https://bmdoherty.github.io/sudoku-react/#400270600798156234020840007237468951849531726561792843082015479070024300004087002)

[Naked Triple, LockedCandidate, jellyfish, XYWing](https://bmdoherty.github.io/sudoku-react/#600802735702356940300407062100975024200183079079624003400560207067240300920738406)

[Naked Quad](https://bmdoherty.github.io/sudoku-react/#624900000739100008815004000400009370300040006591003002900400200100296004248357169)

[Hidden double](https://bmdoherty.github.io/sudoku-react/#049132000081479000327685914096051800075028000038046005853267000712894563964513000)

[Hidden triplet](https://bmdoherty.github.io/sudoku-react/#400000005000200700001000608009102300302097000070060000020051006086030000500009000)

[Hidden Quad](https://bmdoherty.github.io/sudoku-react/#000374200000082040000000000000030826600090004805046970547020009000000405010450702)

[Hidden double, Hidden Quad, XY Wing](https://bmdoherty.github.io/sudoku-react/#632145978810090004040080010000850000160274000000960000481529060753416009296738040)

[Hidden double, swordfish & XY Wing](https://bmdoherty.github.io/sudoku-react/#195367248078050369306098157003780590709005006584906710832549671907013025051072900)

[Hidden double, LockedCandidate, jellyfish](https://bmdoherty.github.io/sudoku-react/#204103580000020341103485600732954168005010900619832400001508200300240000026300004)

[jellyfish](https://bmdoherty.github.io/sudoku-react/#200000003080030050003402100001205400000090000009308600002506900090020070400000001)

[euler 6: lockedCandidate, hidden triple, hidden Double & XWing](https://bmdoherty.github.io/sudoku-react/#043080250600000000000001094900004070000608000010200003820500000000000005034090710)

[long running failure (unsolved): ](https://bmdoherty.github.io/sudoku-react/#024000000000007100090000000000000084000075000600030000000400029000200300100000000)

### Dependencies
babel (transpiling) + jest (testing) + husky (pre commit hooks)

### Coverage Report
[build artifacts from travis-ci](https://bmdoherty.github.io/sudoku/)
