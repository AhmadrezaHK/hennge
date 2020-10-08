import { Email } from "./model";
import dayjs from "dayjs";

const emailList: Email[] = [
    {
        from: "aaa@example.com",
        to: ["zzz.zzz@example.com"],
        subject: "[ HR-888 ] Notice of official announcement",
        date: "",
        key: "1",
    },
    {
        from: "bbb.bbbb@examasd.qwe",
        to: ["yyy@example.com"],
        subject: '[web:333] "Web Contact"',
        date: "",
        key: "2",
    },
    {
        from: "ccc@example.com",
        to: ["xxx@example.com", "yyqde@example.info"],
        subject: "Happy New Year! Greetings for the New Year.",
        date: "",
        key: "3",
    },
    {
        from: "ddd.dddd@example.xyz",
        to: [
            "vvv.vvssssssssssv@example.com",
            "jjasssssssss.asd@example.me",
        ],
        subject:
            "[HR-887(Revised: Office Expansion Project Team)] Notice of off skjfhelx slfjhqw faslfkhqwev dsafqe khsf.",
        date: "",
        key: "4",
    },
    {
        from: "eee@example.com",
        to: [
            "sss@example.com",
            "kljassadsdsdsd@example.me",
            "psdsdsdsoqew@example.org",
        ],
        subject: "[Github] Logout page",
        date: "",
        key: "5",
    },
    {
        from: "fff.ffff@example.co",
        to: ["qqq.qqq@example.com"],
        subject: "[dev] Postfix 3.1.12 / 3.2.9 / 3.3.4 / 3.4.5",
        date: "",
        key: "6",
    },
    {
        from: "ggg@example.com",
        to: ["ppp@example.com"],
        subject: "Re: [Github] Brush-up on loading animation",
        date: "",
        key: "7",
    },
    {
        from: "hhh.hhh@example.com",
        to: ["ooo.ooo@example.com"],
        subject: "Workplace Summary for sample, Inc.: Jun 2 - Jun 9",
        date: "",
        key: "8",
    },
    {
        from: "issdasdii@example.com",
        to: ["nnn@example.com"],
        subject: "I love you",
        date: "",
        key: "9",
    },
    {
        from: "qwewqasd@dsf.asdf",
        to: ["asd@dsqwef@dsaf.asdf"],
        subject: "[info:888] ABC EQUIPMENT COMPANY",
        date: "",
        key: "102",
    },
    {
        from: "ahmadreza@dsf.asdf",
        to: ["Pablo-Diego-José-Francisc@dsqwef@dsaf.asdf"],
        subject: "[info:888] ABC EQUIPMENT COMPANY",
        date: "",
        key: "10",
    },
];

emailList.forEach((email, index) => {
    if (index < 3) {
        email.date = dayjs()
            .subtract(Math.floor(Math.random() * 24), "hour")
            .subtract(Math.floor(Math.random() * 60), "minute")
            .format("YYYY-MM-DDTHH:mm:ss");
        return;
    } else if (index < 6) {
        email.date = dayjs()
            .subtract(Math.floor(Math.random() * 24 * 30 * 12 + 24), "hour")
            .subtract(Math.floor(Math.random() * 60), "minute")
            .format("YYYY-MM-DDTHH:mm:ss");
        return;
    }
    email.date = email.date = dayjs()
        .subtract(Math.floor(Math.random() * 52 * 5 + 52), "week")
        .subtract(Math.floor(Math.random() * 60), "minute")
        .format("YYYY-MM-DDTHH:mm:ss");
});

export { emailList };
