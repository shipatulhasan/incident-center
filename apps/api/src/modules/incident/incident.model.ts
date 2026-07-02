import mongoose, {
  InferSchemaType,
  HydratedDocument,
  Model,
} from "mongoose";

const timelineSchema = new mongoose.Schema<ITimeline>(
  {
    type: {
      type: String,
      enum: [
        "created",
        "comment",
        "status",
        "assignment",
        "severity",
        "postmortem",
        "system",
      ],
      default: "comment",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

const actionItemSchema = new mongoose.Schema<IActionItem>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: String,
      required: true,
      trim: true,
    },

    dueDate: Date,

    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
        "critical",
      ],
      default: "low",
    },

    status: {
      type: String,
      enum: [
        "open",
        "investigating",
        "resolved",
      ],
      default: "open",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    resolvedAt: Date,

    rootCause: {
      type: String,
      default: "",
      trim: true,
    },

    impact: {
      type: String,
      default: "",
      trim: true,
    },

    resolution: {
      type: String,
      default: "",
      trim: true,
    },

    actionItems: [actionItemSchema],

    timeline: [timelineSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

incidentSchema.virtual("mttrMinutes").get(function () {
  if (!this.startedAt || !this.resolvedAt) {
    return null;
  }

  return Math.round(
    (this.resolvedAt.getTime() -
      this.startedAt.getTime()) /
      60000
  );
});

export type TIncident = InferSchemaType<
  typeof incidentSchema
>;

export type TIncidentDocument =
  HydratedDocument<TIncident>;

export type TIncidentModel =
  Model<TIncident>;

const Incident =
  mongoose.model<TIncident>(
    "Incident",
    incidentSchema
  );

export default Incident;