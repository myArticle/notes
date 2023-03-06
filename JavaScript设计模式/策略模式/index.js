{
    // 计算奖金 —— if-else/case-switch 的简单粗暴方式
    const calculateBonus = function (performanceLevel, salary) {
        if (performanceLevel === 'S') return salary * 6
        if (performanceLevel === 'A') return salary * 5
        if (performanceLevel === 'B') return salary * 4
    }
    console.log(calculateBonus('A', 1500))  // 7500
    console.log(calculateBonus('B', 1500))  // 6000
}

{
    // 计算奖金 —— 使用组合函数
    const
        performanceS = function (salary) { return salary * 6 },
        performanceA = function (salary) { return salary * 5 },
        performanceB = function (salary) { return salary * 4 },
        calculateBonus = function (performanceLevel, salary) {
            if (performanceLevel === 'S') return performanceS(salary)
            if (performanceLevel === 'A') return performanceA(salary)
            if (performanceLevel === 'B') return performanceB(salary)
        }
    console.log(calculateBonus('A', 1500))  // 7500
    console.log(calculateBonus('B', 1500))  // 6000
}

{
    // 计算奖金 —— 使用策略模式(面向对象)
    const performanceS = function () { }
    performanceS.prototype.calculate = function (salary) { return salary * 6 }
    const performanceA = function () { }
    performanceA.prototype.calculate = function (salary) { return salary * 5 }
    const performanceB = function () { }
    performanceB.prototype.calculate = function (salary) { return salary * 4 }
    const Bonus = function (strategy = null, salary = null) {
        this.strategy = strategy
        this.salary = salary
    }
    Bonus.prototype.setSalary = function (salary) { this.salary = salary }
    Bonus.prototype.setStrategy = function (strategy) { this.strategy = strategy }
    Bonus.prototype.getBonus = function () { return this.strategy.calculate(this.salary) }

    const bonus = new Bonus()
    bonus.setSalary(10000)
    bonus.setStrategy(new performanceS())
    console.log(bonus.getBonus())   // 60000

    bonus.setStrategy(new performanceB())
    console.log(bonus.getBonus())   // 40000
}

{
    // 计算奖金 —— 使用策略模式(javascript)
    const strategies = {
        'S': function (salary) { return salary * 6 },
        'A': function (salary) { return salary * 5 },
        'B': function (salary) { return salary * 4 },
    }

    const calculateBonus = function (level, salary) { return strategies[level](salary) }
    console.log(calculateBonus('S', 10000))   // 60000
    console.log(calculateBonus('B', 10000))   // 40000
}