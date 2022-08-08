import { getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";
import { PreferenceValues } from "../@types/preferences";
import { Project, Task, TimeEntry, Timer } from "../@types/models";

function headers(token: string) {
  return {
    "X-Auth-Token": token,
    "Content-Type": "application/json; charset=utf-8",
  };
}

function request(url: string, method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH" = "GET", body?: object) {
  const { host, hakunaApiKey: token } = getPreferenceValues<PreferenceValues>();

  return fetch(`https://${host}.hakuna.ch/api/v1/${url}`, {
    method: method,
    headers: headers(token),
    body: body ? JSON.stringify(body) : null,
  });
}

export async function getTimer() {
  return (await (await request("timer")).json()) as Timer;
}

export function startTimer(projectId: number, taskId: number, start?: string) {
  return request("timer", "POST", {
    task_id: taskId,
    project_id: projectId,
    start_time: start,
  });
}

export function stopTimer() {
  return request("timer", "PUT");
}

export async function listTimeEntries(start: string, end: string) {
  return (await (await request(`time_entries?start_date=${start}&end_date=${end}`)).json()) as TimeEntry[];
}

export function deleteTimeEntry(id: number) {
  return request(`time_entries/${id}`, "DELETE");
}

export async function getProjects() {
  return [
    {
      id: 1,
      name: "Launch Rocket",
      archived: false,
      client: "SpaceX",
      tasks: [],
    },
    {
      id: 2,
      name: "Supporting the Ukraine",
      archived: false,
      client: "The World",
      tasks: [],
    },
    {
      id: 3,
      name: "Drawing Mona Lisa",
      archived: false,
      client: "Leonardo da Vinci",
      tasks: [],
    },
  ] as Project[];

  return (await (await request("projects")).json()) as Project[];
}

export async function getTasks() {
  return (await (await request("tasks")).json()) as Task[];
}
