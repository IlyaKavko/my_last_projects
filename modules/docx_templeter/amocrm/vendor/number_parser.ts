export function parseNumber(c) {
    function k(b, c) {
        var d = c[0],
            e = c[1],
            f = c[2];
        return b % 10 == 1 && b % 100 != 11 ? d : b % 10 >= 2 && b % 10 <= 4 && (b % 100 < 10 || b % 100 >= 20) ? e : f
    }
    let a;
    for (var d = {
        0: {
            1: "\u043e\u0434\u0438\u043d",
            2: "\u0434\u0432\u0430",
            3: "\u0442\u0440\u0438",
            4: "\u0447\u0435\u0442\u044b\u0440\u0435",
            5: "\u043f\u044f\u0442\u044c",
            6: "\u0448\u0435\u0441\u0442\u044c",
            7: "\u0441\u0435\u043c\u044c",
            8: "\u0432\u043e\u0441\u0435\u043c\u044c",
            9: "\u0434\u0435\u0432\u044f\u0442\u044c",
            10: "\u0434\u0435\u0441\u044f\u0442\u044c",
            11: "\u043e\u0434\u0438\u043d\u043d\u0430\u0434\u0446\u0430\u0442\u044c",
            12: "\u0434\u0432\u0435\u043d\u0430\u0434\u0446\u0430\u0442\u044c",
            13: "\u0442\u0440\u0438\u043d\u0430\u0434\u0446\u0430\u0442\u044c",
            14: "\u0447\u0435\u0442\u044b\u0440\u043d\u0430\u0434\u0446\u0430\u0442\u044c",
            15: "\u043f\u044f\u0442\u043d\u0430\u0446\u0430\u0442\u044c",
            16: "\u0448\u0435\u0441\u0442\u043d\u0430\u0434\u0446\u0430\u0442\u044c",
            17: "\u0441\u0435\u043c\u043d\u0430\u0434\u0446\u0430\u0442\u044c",
            18: "\u0432\u043e\u0441\u0435\u043c\u043d\u0430\u0434\u0446\u0430\u0442\u044c",
            19: "\u0434\u0435\u0432\u044f\u0442\u043d\u0430\u0434\u0446\u0430\u0442\u044c",
            20: "\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044c",
            30: "\u0442\u0440\u0438\u0434\u0446\u0430\u0442\u044c",
            40: "\u0441\u043e\u0440\u043e\u043a",
            50: "\u043f\u044f\u0442\u044c\u0434\u0435\u0441\u044f\u0442",
            60: "\u0448\u0435\u0441\u0442\u044c\u0434\u0435\u0441\u044f\u0442",
            70: "\u0441\u0435\u043c\u044c\u0434\u0435\u0441\u044f\u0442",
            80: "\u0432\u043e\u0441\u0435\u043c\u044c\u0434\u0435\u0441\u044f\u0442",
            90: "\u0434\u0435\u0432\u044f\u043d\u043e\u0441\u0442\u043e",
            100: "\u0441\u0442\u043e",
            200: "\u0434\u0432\u0435\u0441\u0442\u0438",
            300: "\u0442\u0440\u0438\u0441\u0442\u0430",
            400: "\u0447\u0435\u0442\u044b\u0440\u0435\u0441\u0442\u0430",
            500: "\u043f\u044f\u0442\u044c\u0441\u043e\u0442",
            600: "\u0448\u0435\u0441\u0442\u044c\u0441\u043e\u0442",
            700: "\u0441\u0435\u043c\u044c\u0441\u043e\u0442",
            800: "\u0432\u043e\u0441\u0435\u043c\u044c\u0441\u043e\u0442",
            900: "\u0434\u0435\u0432\u044f\u0442\u044c\u0441\u043e\u0442"
        },
        1: {
            1: "\u043e\u0434\u043d\u0430",
            2: "\u0434\u0432\u0435"
        }
    }, i = {
        0: ["", "", ""],
        1: ["\u0442\u044b\u0441\u044f\u0447\u0430", "\u0442\u044b\u0441\u044f\u0447\u0438", "\u0442\u044b\u0441\u044f\u0447"],
        2: ["\u043c\u0438\u043b\u043b\u0438\u043e\u043d", "\u043c\u0438\u043b\u043b\u0438\u043e\u043d\u0430", "\u043c\u0438\u043b\u043b\u0438\u043e\u043d\u043e\u0432"],
        3: ["\u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434", "\u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434\u0430", "\u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434\u043e\u0432"],
        4: ["\u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d", "\u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d\u0430", "\u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d\u043e\u0432"],
        5: ["\u043a\u0432\u0430\u0434\u0440\u0438\u043b\u043b\u0438\u043e\u043d", "\u043a\u0432\u0430\u0434\u0440\u0438\u043b\u043b\u0438\u043e\u043d\u0430", "\u043a\u0432\u0430\u0434\u0440\u0438\u043b\u043b\u0438\u043e\u043d\u043e\u0432"],
        6: ["\u043a\u0432\u0438\u043d\u0442\u0438\u043b\u043b\u0438\u043e\u043d", "\u043a\u0432\u0438\u043d\u0442\u0438\u043b\u043b\u0438\u043e\u043d\u0430", "\u043a\u0432\u0438\u043d\u0442\u0438\u043b\u043b\u0438\u043e\u043d\u043e\u0432"]
    }, h = "", j = (("" + c).match(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g)||[]).reverse(), e = 0; e < j.length; e++) {
        for (var f = d[e], c: any = j[e], b = "", g = 0; g < c.length; g++)
            if (a = c.substr(g), f && f[a] || d[0][a]) {
                b = b + " " + (f && f[a] || d[0][a]);
                break
            } else
                a = +c.substr(g, 1) * Math.pow(10, a.length - 1), +a in d[0] && (b = b + " " + d[0][a]);
        b && (b = "" + b + " " + k(+c, i[e] || i[0]) + "");
        h = b + h
    }
    const res = '' + (h || "\u043d\u043e\u043b\u044c")
    return res.trim()
}