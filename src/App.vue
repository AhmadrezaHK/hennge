<template>
    <div style="max-width: 1200px" class="mx-auto">
        <button class="btn btn-sm" @click="dateRange = ''">
            close
        </button>
        <input ref="datePickerRef" v-model="dateRange" type="text" />
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
                <tr v-for="email in tableData" :key="email.key">
                    <td>
                        {{
                            formatLongString(
                                email.from,
                                MAX_EMAIL_CHAR_SIZE
                            )
                        }}
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <span
                                style="white-space: pre"
                                class="mr-3"
                            >
                                {{
                                    formatEmails(
                                        email.to,
                                        EmailShowingModeList[
                                            email.key
                                        ]
                                    )
                                }}
                            </span>
                            <button
                                v-if="
                                    email.to.length > 1 &&
                                    EmailShowingModeList[
                                        email.key
                                    ] === EmailShowingMode.SHOW_ONE
                                "
                                style="
                                    white-space: nowrap;
                                    padding: 2px;
                                    line-height: 1;
                                "
                                @click="
                                    EmailShowingModeList[email.key] =
                                        EmailShowingMode.SHOW_ALL
                                "
                                class="btn btn-secondary btn-sm"
                            >
                                + {{ email.to.length - 1 }}
                            </button>
                        </div>
                    </td>
                    <td>{{ formatLongString(email.subject, 60) }}</td>
                    <td>{{ formatDate(email.date) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import "./lib/bootstrap.min.css";
import "flatpickr/dist/flatpickr.min.css";

import flatpickr from "flatpickr";
import dayjs from "dayjs";
import {
    defineComponent,
    reactive,
    onMounted,
    watchEffect,
    watch,
    ref,
} from "vue";

import { EmailShowingMode } from "./model";

import { emailList } from "./emailList";

export default defineComponent({
    name: "App",
    setup() {
        const tableData = ref(emailList);
        const datePickerRef = ref(null);
        const dateRange = ref("");

        onMounted(() => {
            flatpickr(datePickerRef.value, {
                mode: "range",
                dateFormat: "Y/m/d",
                onClose(dateArray) {
                    if (dateArray.length <= 1) {
                        tableData.value = emailList;
                        dateRange.value = "";
                    }
                },
            });
        });

        watch(dateRange, (value) => {
            if (!value) {
                tableData.value = emailList;
            } else if (value.includes("to")) {
                const [startDate, endDate] = value.split(" to ");
                tableData.value = emailList.filter((email) => {
                    return (
                        !dayjs(email.date).isBefore(
                            dayjs(startDate)
                        ) &&
                        !dayjs(email.date).isAfter(dayjs(endDate))
                    );
                });
            }
        });

        

        const MAX_EMAIL_CHAR_SIZE = 20;

        const EmailShowingModeList: {
            [index: string]: EmailShowingMode;
        } = reactive(
            emailList.reduce((result, currEmail) => {
                return {
                    ...result,
                    [currEmail.key]: EmailShowingMode.SHOW_ONE,
                };
            }, {})
        );

        function formatLongString(
            str: string,
            maxSize: number
        ): string {
            return str
                .slice(0, maxSize)
                .concat(str.length > maxSize ? "..." : "");
        }

        function formatEmails(
            list: string[],
            mode: EmailShowingMode
        ): string {
            // u could add cache here
            return {
                [EmailShowingMode.SHOW_ALL]: list
                    .map((email) => {
                        return formatLongString(
                            email,
                            MAX_EMAIL_CHAR_SIZE
                        );
                    })
                    .join(", \n"),
                [EmailShowingMode.SHOW_ONE]:
                    list.length > 1
                        ? formatLongString(
                              list[0],
                              MAX_EMAIL_CHAR_SIZE
                          ).concat(
                              list[0].length > MAX_EMAIL_CHAR_SIZE
                                  ? ""
                                  : ", ..."
                          )
                        : formatLongString(
                              list[0],
                              MAX_EMAIL_CHAR_SIZE
                          ),
            }[mode];
        }

        function formatDate(date: string): string {
            if (
                Date.now() - new Date(date).getTime() <
                1000 * 60 * 60 * 24
            ) {
                return dayjs(date).format("HH:mm");
            }
            else if(dayjs(date).year() === dayjs().year()){
                return dayjs(date).format("MMM DD")
            }
            else{
                return dayjs(date).format("YYYY/MM/DD")
            };
        }

        return {
            emailList,

            EmailShowingMode,
            EmailShowingModeList,

            formatEmails,

            formatLongString,

            MAX_EMAIL_CHAR_SIZE,

            formatDate,

            datePickerRef,
            dateRange,

            tableData,
        };
    },
});
</script>

<style>
.table td {
    vertical-align: middle;
}
.table {
    text-align: left;
}
</style>
