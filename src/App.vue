<template>
    <div style="max-width: 1200px" class="mx-auto">
        <button class="btn btn-sm" @click="dateRange = ''">
            close
        </button>
        <input ref="datePickerRef" v-model="dateRange" type="text" />
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">
                        <img
                            v-if="sortField === 'from'"
                            src="./assets/arrow_1.svg"
                            :style="{
                                width: '10px',
                                transform:
                                    sortOrder === 'down'
                                        ? 'rotate(180deg)'
                                        : undefined,
                            }"
                            @click="
                                changeSort(
                                    'order',
                                    {
                                        up: 'down',
                                        down: 'up',
                                    }[sortOrder]
                                )
                            "
                        />
                        <span @click="changeSort('field', 'from')">
                            From
                        </span>
                    </th>
                    <th scope="col">To</th>
                    <th scope="col">Subject</th>
                    <th scope="col">
                        <img
                            v-if="sortField === 'date'"
                            src="./assets/arrow_1.svg"
                            :style="{
                                width: '10px',
                                transform:
                                    sortOrder === 'down'
                                        ? 'rotate(180deg)'
                                        : undefined,
                            }"
                            @click="
                                changeSort(
                                    'order',
                                    {
                                        up: 'down',
                                        down: 'up',
                                    }[sortOrder]
                                )
                            "
                        />
                        <span @click="changeSort('field', 'date')">
                            Date
                        </span>
                    </th>
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
import { useRouter } from "vue-router";

import { EmailShowingMode, sortType, sortOrderType } from "./models";

import { emailList } from "./emailList";

export default defineComponent({
    name: "App",
    setup() {
        const router = useRouter();

        const tableData = ref(emailList);

        const sortField = ref<sortType>("date");
        const sortOrder = ref<sortOrderType>("down");
        function sortFunc(
            sortField: sortType,
            sortOrder: sortOrderType,
            firstEl,
            secondEl
        ): number {
            if (sortField === "date") {
                return {
                    up: dayjs(firstEl[sortField]).diff(
                        dayjs(secondEl[sortField])
                    ),
                    down: dayjs(secondEl[sortField]).diff(
                        dayjs(firstEl[sortField])
                    ),
                }[sortOrder];
            } else {
                return {
                    up:
                        firstEl[sortField] > secondEl[sortField]
                            ? -1
                            : firstEl[sortField] < secondEl[sortField]
                            ? 1
                            : 0,
                    down:
                        firstEl[sortField] < secondEl[sortField]
                            ? -1
                            : firstEl[sortField] > secondEl[sortField]
                            ? 1
                            : 0,
                }[sortOrder];
            }
        }
        function changeSort(
            key: "field" | "order",
            value: sortType | sortOrderType
        ) {
            if (key === "field") {
                sortField.value = value as sortType;
            } else if (key === "order") {
                sortOrder.value = value as sortOrderType;
            }
            router.push({
                query: {
                    ...router.currentRoute.value.query,
                    sort: `${sortField.value}-${sortOrder.value}`,
                },
            });
        }
        watch(
            [sortField, sortOrder],
            ([sField, sOrder]) => {
                let temp;
                tableData.value.sort((firstEl, secondEl) => {
                    temp = sortFunc(
                        sField as sortType,
                        sOrder as sortOrderType,
                        firstEl,
                        secondEl
                    );
                    if (temp === 0) {
                        temp = sortFunc(
                            { date: "from", from: "date" }[
                                sField
                            ] as sortType,
                            sOrder as sortOrderType,
                            firstEl,
                            secondEl
                        );
                    }
                    return temp;
                });
            },
            { immediate: true }
        );

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
        const stopRouterWatcher = watch(
            router.currentRoute,
            (value) => {
                if (value.query.date) {
                    dateRange.value = (value.query
                        .date as string).replace("-", " to ");
                }
                if (value.query.sort) {
                    [sortField.value, sortOrder.value] = (value.query
                        .sort as string).split("-") as [
                        sortType,
                        sortOrderType
                    ];
                }
                stopRouterWatcher();
            }
        );
        watch(dateRange, (value) => {
            if (!value) {
                tableData.value = emailList;
                const query = { ...router.currentRoute.value.query };
                delete query.date;
                router.push({
                    query,
                });
            } else if (value.includes("to")) {
                const [startDate, endDate] = value.split(" to ");
                router.push({
                    query: {
                        ...router.currentRoute.value.query,
                        date: value.replace(" to ", "-"),
                    },
                });
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
            // add cache here
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
            } else if (dayjs(date).year() === dayjs().year()) {
                return dayjs(date).format("MMM DD");
            } else {
                return dayjs(date).format("YYYY/MM/DD");
            }
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

            sortField,
            sortOrder,
            changeSort,
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
