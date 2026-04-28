/*
 * Copyright (C) 2018-2026 Modding Craft ZBD Studio.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import type {CalculationOfPenalty, ContestOptions as IContestOptions, Image, TimeUnit} from "@xcpcio/types";

export class ContestOptions {
  enableOrganization: boolean;
  calculationOfPenalty: CalculationOfPenalty;
  submissionTimestampUnit: TimeUnit;

  submissionHasTimeField: boolean;
  submissionHasLanguageField: boolean;

  submissionEnableActionField: boolean;
  submissionHasReactionField: boolean;
  submissionHasExternalUrlField: boolean;
  submissionHasRealtimeReactionStreamField: boolean;

  reactionVideoUrlTemplate?: string;
  submissionExternalUrlTemplate?: string;

  teamPhotoTemplate?: Image;
  teamWebcamStreamUrlTemplate?: string;
  teamScreenStreamUrlTemplate?: string;

  realtimeReactionWebcamStreamUrlTemplate?: string;
  realtimeReactionScreenStreamUrlTemplate?: string;

  disablePendingPage: boolean;

  constructor() {
    this.enableOrganization = false;
    this.calculationOfPenalty = "in_minutes";
    this.submissionTimestampUnit = "second";

    this.submissionHasTimeField = false;
    this.submissionHasLanguageField = false;

    this.submissionEnableActionField = false;
    this.submissionHasReactionField = false;
    this.submissionHasExternalUrlField = false;
    this.submissionHasRealtimeReactionStreamField = false;

    this.disablePendingPage = false;
  }
}

export function createContestOptions(contestOptionsJSON: IContestOptions = {}): ContestOptions {
  const j = contestOptionsJSON;
  const o = new ContestOptions();

  o.enableOrganization = !!j.enable_organization;

  if (j.calculation_of_penalty) {
    o.calculationOfPenalty = j.calculation_of_penalty;
  }

  if (j.submission_timestamp_unit) {
    o.submissionTimestampUnit = j.submission_timestamp_unit;
  }

  if (j.has_reaction_videos) {
    o.submissionHasReactionField = true;
  }

  if (j.submission_external_url_template) {
    o.submissionHasExternalUrlField = true;
    o.submissionExternalUrlTemplate = j.submission_external_url_template;
  }

  if (j.realtime_reaction_webcam_stream_url_template || j.realtime_reaction_screen_stream_url_template) {
    o.submissionHasRealtimeReactionStreamField = true;
    o.realtimeReactionWebcamStreamUrlTemplate = j.realtime_reaction_webcam_stream_url_template;
    o.realtimeReactionScreenStreamUrlTemplate = j.realtime_reaction_screen_stream_url_template;
  }

  o.submissionEnableActionField = o.submissionHasReactionField || o.submissionHasExternalUrlField || o.submissionHasRealtimeReactionStreamField;
  o.reactionVideoUrlTemplate = j.reaction_video_url_template;
  o.teamPhotoTemplate = j.team_photo_url_template;

  o.teamWebcamStreamUrlTemplate = j.team_webcam_stream_url_template;
  o.teamScreenStreamUrlTemplate = j.team_screen_stream_url_template;

  o.disablePendingPage = !!j.disable_pending_page;

  return o;
}
