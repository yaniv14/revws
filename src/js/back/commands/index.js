// @flow

import { prop } from 'ramda';
import type { GlobalDataType } from 'back/types';
import type { Command } from 'common/types';
import type { Action } from 'back/actions';
import { fixUrl } from 'common/utils/url';
import Types from 'back/actions/types';
import { saveSettings } from './save-settings';
import { deleteCriterion } from './delete-criterion';
import { saveCriterion } from './save-criterion';
import { saveReview } from './save-review';
import { loadData } from './load-data';
import { approveReview } from './approve-review';
import { deleteReview } from './delete-review';
import { undeleteReview } from './undelete-review';

const commands = {
  [ Types.setSettings ]: saveSettings,
  [ Types.deleteCriterion ]: deleteCriterion,
  [ Types.saveCriterion ]: saveCriterion,
  [ Types.saveReview ]: saveReview,
  [ Types.loadData ]: loadData,
  [ Types.deleteReview ]: deleteReview,
  [ Types.undeleteReview ]: undeleteReview,
  [ Types.approveReview ]: approveReview,
};

export default (settings: GlobalDataType) => {
  const api = (cmd: string, payload: any) => {
    return new Promise((resolve, reject) => {
      const failure = (error: string) => {
        console.error("API call error: "+cmd+": "+error);
        resolve({ type: 'failed', error });
      };
      const success = (data) => {
        if (data.success) {
          resolve({ type: 'success', data: data.result });
        } else {
          failure(data.error);
        }
      };
      const error = (xhr, error) => failure(error);
      window.$.ajax({
        url: fixUrl(settings.api),
        type: 'POST',
        dataType: 'json',
        data: {
          ajax: true,
          action: 'command',
          cmd: cmd,
          payload: JSON.stringify(payload)
        },
        success,
        error
      });
    });
  };

  return (store: any) => (next: any) => (action: Action) => {
    const res = next(action);
    const command: Command = prop(action.type, commands);
    if (command) {
      command(action, store, api);
    }
    return res;
  };
};
