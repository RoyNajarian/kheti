export const RESERVATION_TICKETS = [
  {
    id: "explorateur",
    name: "L'Explorateur",
    label: "L'Explorateur (Adulte)",
    description: "Adulte",
    price: 20,
    icon: "/images/logo-explorateur.png",
  },
  {
    id: "scribe",
    name: "Le Scribe",
    label: "Le Scribe (Etudiant)",
    description: "Etudiant (justificatif requis)",
    price: 10,
    icon: "/images/logo-scribe.png",
  },
  {
    id: "scarabee",
    name: "Petit Scarabée",
    label: "Petit Scarabée (Enfant)",
    description: "Enfant (moins de 12 ans)",
    price: 7,
    icon: "/images/logo-petit-scarabee.png",
  },
];

export const RESERVATION_PRICE_BY_TICKET = RESERVATION_TICKETS.reduce(
  (acc, ticket) => {
    acc[ticket.id] = ticket.price;
    return acc;
  },
  {},
);
