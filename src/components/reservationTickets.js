export const RESERVATION_TICKETS = [
  {
    id: "explorateur",
    name: "L'Explorateur",
    label: "L'Explorateur (Adulte)",
    description: "Adulte",
    price: 20,
    icon: "/icons/explorateur.png",
  },
  {
    id: "scribe",
    name: "Le Scribe",
    label: "Le Scribe (Etudiant)",
    description: "Etudiant (justificatif requis)",
    price: 10,
    icon: "/icons/scribe.png",
  },
  {
    id: "scarabee",
    name: "Petit Scarabee",
    label: "Petit Scarabee (Enfant)",
    description: "Enfant (moins de 12 ans)",
    price: 7,
    icon: "/icons/scarabee.png",
  },
];

export const RESERVATION_PRICE_BY_TICKET = RESERVATION_TICKETS.reduce(
  (acc, ticket) => {
    acc[ticket.id] = ticket.price;
    return acc;
  },
  {},
);
