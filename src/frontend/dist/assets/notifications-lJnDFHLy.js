import { r as reactExports, j as jsxRuntimeExports, a as ue } from "./index-CebTjiTu.js";
import { N as NotificationType, R as RegistrationStatus } from "./backend.d-DcSV0aLA.js";
import { A as AdminLayout, U as Users } from "./AdminLayout-B_Ai7nyX.js";
import { B as Badge } from "./badge-Bz0HIF4P.js";
import { c as createLucideIcon, b as useBackend, d as useQuery, B as Button } from "./x-CNxy1RBN.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as Bell } from "./card-CzpBPjzC.js";
import { I as Input } from "./input-CO01C1BR.js";
import { L as Label } from "./label-DvMKma_3.js";
import { T as Textarea } from "./textarea-CHNyu8Qt.js";
import { u as useMutation } from "./useMutation-COpRj0Fj.js";
import { M as MessageCircle } from "./message-circle-DnRjIU2c.js";
import "./shield-DbgbHF9g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
const NOTIFICATION_TYPES = [
  { value: NotificationType.Announcement, label: "Announcement" },
  { value: NotificationType.RegistrationUpdate, label: "Registration Update" },
  { value: NotificationType.ProjectMatch, label: "Project Match" },
  { value: NotificationType.Offer, label: "Offer" },
  { value: NotificationType.Reminder, label: "Reminder" }
];
function AdminNotificationsPage() {
  var _a;
  const { actor, isLoading: actorLoading } = useBackend();
  const [message, setMessage] = reactExports.useState("");
  const [notifType, setNotifType] = reactExports.useState(
    NotificationType.Announcement
  );
  const [recipientMode, setRecipientMode] = reactExports.useState("all");
  const [candidateSearch, setCandidateSearch] = reactExports.useState("");
  const [selectedRecipient, setSelectedRecipient] = reactExports.useState(null);
  const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: ["admin", "candidates"],
    queryFn: () => actor.listAllCandidates(),
    enabled: !!actor && !actorLoading
  });
  const broadcastMutation = useMutation({
    mutationFn: async ({
      recipients,
      msg,
      type
    }) => {
      await actor.broadcastNotification(recipients, msg, type);
    },
    onSuccess: () => {
      ue.success("Notification sent successfully!");
      setMessage("");
    },
    onError: () => ue.error("Failed to send notification.")
  });
  const singleMutation = useMutation({
    mutationFn: async ({
      recipient,
      msg,
      type
    }) => {
      await actor.sendNotification(recipient, msg, type);
    },
    onSuccess: () => {
      ue.success("Notification sent!");
      setMessage("");
      setSelectedRecipient(null);
      setCandidateSearch("");
    },
    onError: () => ue.error("Failed to send notification.")
  });
  const approvedCandidates = candidates.filter(
    (c) => c.registrationStatus === RegistrationStatus.Approved
  );
  const filteredSearch = candidateSearch.trim().length > 0 ? candidates.filter(
    (c) => c.name.toLowerCase().includes(candidateSearch.toLowerCase()) || c.email.toLowerCase().includes(candidateSearch.toLowerCase())
  ) : [];
  const getRecipientCount = () => {
    if (recipientMode === "all") return candidates.length;
    if (recipientMode === "approved") return approvedCandidates.length;
    return selectedRecipient ? 1 : 0;
  };
  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      ue.warning("Message cannot be empty.");
      return;
    }
    if (recipientMode === "specific") {
      if (!selectedRecipient) {
        ue.warning("Please select a recipient.");
        return;
      }
      singleMutation.mutate({
        recipient: selectedRecipient.principalId,
        msg: message,
        type: notifType
      });
    } else {
      const recipients = recipientMode === "all" ? candidates.map((c) => c.principalId) : approvedCandidates.map((c) => c.principalId);
      broadcastMutation.mutate({ recipients, msg: message, type: notifType });
    }
  };
  const isSending = broadcastMutation.isPending || singleMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-2xl", "data-ocid": "admin_notifications.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Send notifications to candidates" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 text-primary" }),
        "Send Notification"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSend, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Recipients" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["all", "approved", "specific"].map(
            (mode) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: recipientMode === mode ? "default" : "outline",
                size: "sm",
                onClick: () => {
                  setRecipientMode(mode);
                  setSelectedRecipient(null);
                  setCandidateSearch("");
                },
                className: recipientMode === mode ? "bg-primary text-primary-foreground" : "border-border/50 hover:border-primary/30",
                "data-ocid": `admin_notifications.recipient_${mode}_toggle`,
                children: mode === "all" ? "All Candidates" : mode === "approved" ? "All Approved" : "Specific Candidate"
              },
              mode
            )
          ) }),
          recipientMode !== "specific" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" }),
            candidatesLoading ? "Loading..." : `${getRecipientCount()} recipient${getRecipientCount() !== 1 ? "s" : ""}`
          ] })
        ] }),
        recipientMode === "specific" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "candidate-search", children: "Search Candidate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "candidate-search",
                value: selectedRecipient ? selectedRecipient.name : candidateSearch,
                onChange: (e) => {
                  setCandidateSearch(e.target.value);
                  setSelectedRecipient(null);
                },
                placeholder: "Search by name or email...",
                className: "bg-input border-border/50",
                "data-ocid": "admin_notifications.candidate_search_input"
              }
            ),
            filteredSearch.length > 0 && !selectedRecipient && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-sm shadow-luxury overflow-hidden max-h-40 overflow-y-auto", children: filteredSearch.slice(0, 6).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "w-full text-left px-3 py-2 text-sm hover:bg-muted/30 transition-colors",
                onClick: () => {
                  setSelectedRecipient(c);
                  setCandidateSearch("");
                },
                "data-ocid": "admin_notifications.candidate_option",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: c.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground ml-2 text-xs", children: c.email })
                ]
              },
              c.principalId.toString()
            )) })
          ] }),
          selectedRecipient && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-xs border-primary/30 text-primary bg-primary/10",
                children: selectedRecipient.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-xs text-muted-foreground hover:text-foreground ml-auto",
                onClick: () => setSelectedRecipient(null),
                children: "Clear"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notif-type", children: "Notification Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "notif-type",
              value: notifType,
              onChange: (e) => setNotifType(e.target.value),
              className: "w-full h-9 px-3 text-sm bg-input border border-border/50 rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
              "data-ocid": "admin_notifications.type_select",
              children: NOTIFICATION_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t.value, children: t.label }, t.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notif-message", children: "Message *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "notif-message",
              value: message,
              onChange: (e) => setMessage(e.target.value),
              placeholder: "Aapke liye ek important message hai...",
              rows: 4,
              required: true,
              className: "bg-input border-border/50 resize-none",
              "data-ocid": "admin_notifications.message_textarea"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
            message.length,
            " characters"
          ] })
        ] }),
        message.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-muted/30 border border-border/30 rounded-sm space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-medium flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3 h-3" }),
            " Preview"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: message }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-xs border-primary/30 text-primary bg-primary/5",
                children: (_a = NOTIFICATION_TYPES.find((t) => t.value === notifType)) == null ? void 0 : _a.label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "→ ",
              getRecipientCount(),
              " recipient",
              getRecipientCount() !== 1 ? "s" : ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            disabled: isSending || !message.trim() || getRecipientCount() === 0,
            className: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
            "data-ocid": "admin_notifications.send_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2" }),
              isSending ? "Sending..." : `Send to ${getRecipientCount()} Recipient${getRecipientCount() !== 1 ? "s" : ""}`
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border/50 border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Notification Tips" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-muted-foreground space-y-1 list-disc list-inside", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Broadcast notifications are sent to all selected recipients at once." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: 'Use "Project Match" type when notifying about new casting opportunities.' }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Candidates can view all notifications in their dashboard." })
        ] })
      ] })
    ] }) }) })
  ] }) });
}
export {
  AdminNotificationsPage
};
