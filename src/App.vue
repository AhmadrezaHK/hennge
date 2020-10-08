<template>
    <div style="max-width: 1200px" class="mx-auto">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Subject</th>
                    <th scope="col">Date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="email in emailList" :key="email.key">
                    <td>{{ email.from }}</td>
                    <td>{{ email.to }}</td>
                    <td>{{ email.subject }}</td>
                    <td>{{ email.date }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import "./lib/bootstrap.min.css";

import { defineComponent } from "vue";

export default defineComponent({
    name: "App",
    setup() {
        const emailList = [
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
                to: ["vvv.vvv@example.com", "jja.asd@example.me"],
                subject: "[HR-887(Revised: Office Expansion Project Team)] Notice of off skjfhelx slfjhqw faslfkhqwev dsafqe khsf.",
                date: "",
                key: "4",
            },
            {
                from: "eee@example.com",
                to: ["sss@example.com", "kljasd@example.me", "poqew@example.org"],
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
                from: "iii@example.com",
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
                key: "10",
            },
        ];

        return {
            emailList,
        };
    },
});
</script>
