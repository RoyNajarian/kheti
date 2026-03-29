import i18n from "../i18n";

const getTicketText = (id, field) => {
  return i18n.t(`tickets.${id}.${field}`);
};

export const RESERVATION_TICKETS = [
  {
    id: "explorateur",
    get name() {
      return getTicketText("explorateur", "name");
    },
    get label() {
      return getTicketText("explorateur", "label");
    },
    get description() {
      return getTicketText("explorateur", "description");
    },
    price: 20,
    icon: "/images/logo-explorateur.png",
  },
  {
    id: "scribe",
    get name() {
      return getTicketText("scribe", "name");
    },
    get label() {
      return getTicketText("scribe", "label");
    },
    get description() {
      return getTicketText("scribe", "description");
    },
    price: 10,
    icon: "/images/logo-scribe.png",
  },
  {
    id: "scarabee",
    get name() {
      return getTicketText("scarabee", "name");
    },
    get label() {
      return getTicketText("scarabee", "label");
    },
    get description() {
      return getTicketText("scarabee", "description");
    },
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
