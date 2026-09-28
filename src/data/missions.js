export const missions = [
  {
    id: "water",
    name: "Drink Water",
    icon: "💧",
    description: "Drink 8 glasses of water",
    target: 8,
    unit: "glasses",
    singularUnit: "glass",
    verificationType: "manual",
    reward: {
      currency: "coolant",
      amount: 10,
    },
  },
  {
    id: "exercise",
    name: "Exercise / Meditation",
    icon: "🏃",
    description: "Exercise or meditate — you choose the duration",
    target: 30,
    unit: "minutes",
    singularUnit: "minute",
    verificationType: "timer",
    reward: {
      currency: "cells",
      amount: 5,
    },
  },
  {
    id: "sleep",
    name: "Sleep Well",
    icon: "😴",
    description: "Get at least 8 hours of sleep",
    target: 8,
    unit: "hours",
    singularUnit: "hour",
    verificationType: "manual",
    reward: {
      currency: "shards",
      amount: 8,
    },
  },
]