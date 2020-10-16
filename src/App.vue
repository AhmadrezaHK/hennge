<template>
    <div style="max-width: 1200px" class="mx-auto">
        <div class="calendar-container">
            <button
                v-show="dateRange"
                class="btn btn-sm"
                @click="dateRange = ''"
            >
                &times;
            </button>
            <img src="./assets/calender.svg" alt="calendar" />
            <input
                ref="datePickerRef"
                v-model="dateRange"
                class="form-control"
                type="text"
            />
        </div>
        <div class="result-count">
            Results:
            <span style="font-size: 1.25rem">{{
                tableData.length
            }}</span>
            mail{{ tableData.length > 1 ? "s" : "" }}
        </div>
        <table class="table">
            <thead class="bg-light text-secondary">
                <tr>
                    <th scope="col" class="clickable-th">
                        <span @click="changeSort('field', 'from')">
                            From
                        </span>
                        <img
                            v-if="sortField === 'from'"
                            src="./assets/arrow_1.svg"
                            :style="{
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
                    </th>
                    <th scope="col"><span>To</span></th>
                    <th scope="col"><span>Subject</span></th>
                    <th scope="col" class="clickable-th">
                        <span @click="changeSort('field', 'date')">
                            Date
                        </span>
                        <img
                            v-if="sortField === 'date'"
                            src="./assets/arrow_1.svg"
                            :style="{
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
                    <td class="date-cell">
                        <a
                            v-if="email.attachment"
                            :href="email.attachment"
                            download="resume.pdf"
                        >
                            <img
                                src="./assets/icon_clip.svg"
                                alt="attachment"
                            />
                        </a>
                        {{ formatDate(email.date) }}
                    </td>
                </tr>
                <tr v-if="!tableData.length" class="empty-table">
                    <img
                        src="./assets/logo.png"
                        alt="logo"
                        class="logo"
                    />
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

<style lang="scss">
$light-color: #dee2e6;
.table {
    text-align: left;
    td {
        vertical-align: middle;
    }
    tbody {
        tr {
            cursor: pointer;
            &:hover {
                background-color: #f6f8fa;
                color: #0839de;
            }
        }
    }
    td,
    th {
        border-width: 2px;
    }
}
.calendar-container {
    display: flex;
    position: relative;
    width: 100%;
    max-width: 300px;
    margin-bottom: 1rem;

    img {
        position: absolute;
        width: 30px;
        position: absolute;
        left: 8px;
        top: 8px;
    }
    input {
        height: 45px;
        width: 100%;
        border-radius: 8px;
        padding-left: 45px;
        padding-right: 25px;
        text-align: center;
        padding-top: 9px;

        &.form-control[readonly] {
            background-color: #fff;
        }
    }
    button {
        position: absolute;
        right: 8px;
        align-self: center;
        font-size: 2rem;
        padding: 0;
        line-height: 1;
        &:focus {
            box-shadow: none;
        }
    }
}
.empty-table {
    height: calc(100vh - 250px);
    position: relative;
    .logo {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 150px;
        margin: auto;
    }
}
.clickable-th {
    span,
    img {
        cursor: pointer;
    }
    img {
        width: 10px;
    }
}
.result-count {
    text-align: left;
    font-weight: bold;
}
.date-cell {
    position: relative;
    font-weight: bold;
    a {
        display: block;
        position: absolute;
        left: -20px;

        img {
            width: 20px;
        }
    }
}
@media screen and (max-width: 1199px) {
    .result-count,
    .calendar-container {
        margin-left: 0.75rem;
    }
}
@media screen and (max-width: 767px) {
    thead {
        display: flex;
        tr {
            width: 100%;
            border-bottom: 2px solid $light-color;
            border-top: 2px solid $light-color;
        }
        th {
            border: none !important;
            padding-left: 0 !important;
            span {
                border-left: 2px solid $light-color;
                padding-left: 0.75rem;
            }
            &:first-child {
                span {
                    border-left: none;
                }
            }
        }
    }
    tbody {
        display: flex;
        flex-direction: column;
        tr {
            display: flex;
            flex-direction: column;
            border-bottom: 2px solid $light-color;
            position: relative;
            padding-top: 25px;
            &::after {
                content: "";
                position: absolute;
                left: 25px;
                top: 25px;
                background: url("./assets/icon_mail_sp.svg") no-repeat;
                background-size: contain;
                width: 25px;
                height: 50px;
            }
            td:nth-child(1),
            td:nth-child(2) {
                padding: 1px 0.75rem 3px 65px;
            }
            td:nth-child(1) {
                font-weight: bold;
            }
            td:nth-last-child(1) {
                position: absolute;
                right: 5px;
                top: 15px;
            }
        }
        td {
            border: none !important;
        }
    }
}
</style>
