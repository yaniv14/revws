// @flow

import type {Element} from "React";import React from 'react';
import debounce from 'debounce';
import classnames from 'classnames';
import type { DisplayCriteriaType, GradingShapeType, ReviewType, ShapeColorsType, CriteriaType } from 'common/types';
import { F, isNil, sortBy, prop, values, filter, has } from 'ramda';
import { hasRatings, averageGrade } from 'common/utils/reviews';
import Grading from 'common/components/grading/grading';
import ReplyIcon from 'material-ui-icons/Reply';
import styles from './review-list-item.less';
import Textarea from 'common/components/text-area/text-area';
import InlineCriteria from 'common/components/criteria/inline';
import BlockCriteria from 'common/components/criteria/block';
import Button from 'material-ui/Button';
import formatDate from 'locutus/php/datetime/date';

type Props = {
  shopName: string,
  shape: GradingShapeType,
  colors?: ShapeColorsType,
  dateFormat: string,
  shapeSize: number,
  criteria: CriteriaType,
  displayCriteria: DisplayCriteriaType,
  displayReply: boolean,
  displayMicrodata: boolean,
  review: ReviewType,
  onEdit: (ReviewType)=>void,
  onSaveReply?: (?string)=>void,
  onDelete: (ReviewType)=>void,
  onVote: (ReviewType, 'up' | 'down')=>void,
  onReport: (ReviewType)=>void
};

type State = {
  editReply: ?string
}

class ReviewListItem extends React.PureComponent<Props, State> {
  static displayName: ?string = 'ReviewListItem';

  static defaultProps: {|
  displayReply: boolean,
  onDelete: any,
  onEdit: any,
  onReport: any,
  onVote: any,
  |} = {
    displayReply: true,
    onEdit: F,
    onDelete: F,
    onVote: F,
    onReport: F
  }

  state: State = {
    editReply: null
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.state.editReply && this.props.review.reply != nextProps.review.reply) {
      this.stopEditReply();
    }
  }

  componentDidMount() {
    if (window.$) {
      const $ = window.$;
      if ($.fancybox) {
        $('[data-revws-image-group="'+this.props.review.id+'"]').fancybox();
      }
    }
  }

  render(): Element<"div"> {
    const { colors, shape, shapeSize, onReport, onEdit, onDelete, onVote, review, criteria, displayCriteria, dateFormat, displayMicrodata } = this.props;
    const { displayName, date, title, underReview, verifiedBuyer, content, canVote, canReport, grades, canEdit, canDelete, loading } = review;
    const classes = classnames('revws-review flex-column mb-2 mt-0 p-0', {
      'revws-review-under-review': underReview,
      'revws-verified-buyer': verifiedBuyer
    });

    const microdata = bindMicrodata(displayMicrodata);

    const crits = displayCriteria == 'none' ? [] : getCriteriaToRender(criteria, grades);
    const showCriteria = crits.length > 1;
    let stars = undefined;
    let grade = 0;

    if (hasRatings(review)) {
      grade = averageGrade(review);
      stars = (
        <Grading
          className={'col-auto'}
          grade={grade}
          shape={shape}
          type={'product'}
          size={shapeSize}
          colors={colors} />
      );
    }

    return (
      <div className={classes} {...microdata({ itemProp: "review", itemScope: true, itemType: "http://schema.org/Review" })}>
        { loading  && <div className="revws-loading" /> }
        <div className="revws-review-author row">
          <div className="revws-review-author-name col-12" {...microdata({ itemProp: "author", itemScope: true, itemType: "http://schema.org/Person"})}>
            <div className="row align-items-center sm-gutters">
              <div className="col-auto">
                <img src="/modules/revws/views/img/avatar.svg" width="34" height="34" alt=""/>
              </div>
              <div className="col">
                <span {...microdata({ itemProp: "name" })}>{ displayName }</span>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row align-items-center sm-gutters">
              {stars}
              {title && (
                <p className="revws-review-title col mb-0" {...microdata({ itemProp: "name" })}>{ title }</p>
              )}
            </div>
          </div>
          {stars && displayMicrodata && (
            <div className="revws-hidden" itemProp="reviewRating" itemScope itemType="http://schema.org/Rating">
              <meta itemProp="worstRating" content="1" />
              <meta itemProp="ratingValue" content={grade} />
              <meta itemProp="bestRating" content="5" />
            </div>
          )}
          <div className="revws-review-date col-12" {...microdata({ itemProp: "datePublished", content: formatDate("Y-m-d", date)})}>
            {__("Reviewed at")}: {formatDate(dateFormat, date)}
          </div>
          {verifiedBuyer && <div className="revws-verified-buyer-badge col-12">{__("Verified purchase")}</div>}
        </div>

        <div className="revws-review-details row">
          <div className="revws-review-review col-12">
            <div className="revws-review-box">
              {showCriteria && displayCriteria == 'inline' && (
                <InlineCriteria
                  grades={review.grades}
                  shape={shape}
                  shapeSize={shapeSize}
                  colors={colors}
                  criteria={crits} />
              )}
              {underReview && (
                <div className="revws-under-review">{__("This review hasn't been approved yet")}</div>
              )}
              {content && (
                <p className="revws-review-content mb-1" {...microdata({ itemProp: "content" })}>{ this.renderContent(content) }</p>
              )}
              {!title && !content && (
                <p className="revws-review-content revws-review-without-details">
                  {__("Customer didn't write any details")}
                </p>
              )}
            </div>
            {showCriteria && displayCriteria == 'side' && (
              <BlockCriteria
                grades={review.grades}
                shape={shape}
                shapeSize={shapeSize}
                colors={colors}
                criteria={crits} />
            )}
          </div>
          { this.renderImages() }
          <div className="revws-actions col-12">
            {canVote && (
              <div className="revws-action revws-useful">
                {__('Was this comment useful to you?')}
                <a className="btn btn-xs btn-link" onClick={() => onVote(review, 'up')}>
                  <i className="bi bi-hand-thumbs-up"></i> {__('Yes')}
                </a>
                <a className="btn btn-xs btn-link" onClick={() => onVote(review, 'down')}>
                  <i className="bi bi-hand-thumbs-down"></i> {__('No')}
                </a>
              </div>
            )}
            {canReport && (
              <div className="revws-action revws-report">
                <a className="btn btn-xs btn-link" onClick={() => onReport(review)}>
                  <i className="bi bi-flag"></i> {__('Report abuse')}
                </a>
              </div>
            )}
            {canEdit && (
              <div className="revws-action revws-edit">
                <a className="btn btn-xs btn-link" onClick={() => onEdit(review)}>
                  <i className="bi bi-pencil"></i> {__('Edit review')}
                </a>
              </div>
            )}
            {canDelete && (
              <div className="revws-action revws-delete">
                <a className="btn btn-xs btn-link" onClick={() => onDelete(review)}>
                  <i className="bi bi-trash"></i> {__('Delete review')}
                </a>
              </div>
            )}
          </div>
          { this.renderReplies() }
        </div>
      </div>
    );
  }

  renderImages: (() => null | Element<"div">) = () => {
    const { images } = this.props.review;
    if (!images || !images.length) {
      return null;
    }
    return (
      <div className="revws-images col-12">
        { images.map(this.renderImage) }
      </div>
    );
  }

  renderImage: ((image: string) => Element<"a">) = (image: string) => (
    <a key={image} data-revws-image-group={this.props.review.id} rel='1' href={image}>
      <div className="revws-image">
        <img src={getThumbnail(image)} />
      </div>
    </a>
  );

  renderReplies: (() => null | Element<"div"> | boolean) = () => {
    const { displayReply, review, onSaveReply } = this.props;
    const { editReply } = this.state;
    if (! isNil(editReply)) {
      return this.renderEditReply(editReply || '');
    }
    if (review.reply) {
      return displayReply && this.renderReply(review.reply);
    }
    if (onSaveReply) {
      return this.renderReplyPlaceholder();
    }
    return null;
  }

  renderReply: ((reply: string) => Element<"div">) = (reply: string) => {
    const shopName = this.props.shopName;
    const canEdit = !!this.props.onSaveReply;
    const clazz = classnames("revws-reply", {
      [ styles.editable ]: canEdit
    });
    const onClick = canEdit ? this.startEditReply : null;
    return (
      <div className="revws-replies col-12">
        <div className={clazz} onClick={onClick}>
          <div className="revws-reply-title">
            {__('Reply from %s:', shopName)}
          </div>
          <div className="revws-reply-content">
            { this.renderContent(reply) }
          </div>
        </div>
      </div>
    );
  }

  renderEditReply: ((reply: string) => Element<"div">) = (reply: string) => {
    return (
      <div className="revws-replies">
        <Textarea
          value={reply}
          label={__('Your answer')}
          placeholder={__('Write your answer')}
          onChange={e => this.setState({ editReply: e.target.value })} />
        <div className={styles.margin}>
          <Button onClick={this.stopEditReply}>
            {__('Cancel')}
          </Button>
          <Button color='accent' onClick={debounce(this.saveReply, 300, true)}>
            {__('Save')}
          </Button>
        </div>
      </div>
    );
  }

  renderReplyPlaceholder: (() => Element<"div">) = () => {
    return (
      <div className="revws-replies">
        <div className={styles.reply} onClick={this.startEditReply}>
          <ReplyIcon />
          {__('Click here to reply')}
        </div>
      </div>
    );
  }

  startEditReply: (() => void) = () => {
    const review = this.props.review;
    this.setState({ editReply: review.reply || '' });
  }

  stopEditReply: (() => void) = () => {
    this.setState({ editReply: null });
  }

  saveReply: (() => void) = () => {
    const { onSaveReply } = this.props;
    if (onSaveReply) {
      const reply = this.state.editReply || null;
      this.stopEditReply();
      onSaveReply(reply);
    }
  }

  renderContent: ((
  content: ?string
  ) => null | string | Array<any | Element<"br"> | Element<"span">>) = (content: ?string) => {
    if (! content) {
      return null;
    }
    const split = content.split(/\r?\n/);
    const cnt = split.length;
    if (cnt <= 1) {
      return content;
    }
    const ret = [];
    for (var i=0; i<cnt; i++) {
      const item = split[i];
      ret.push(<span key={i}>{item}</span>);
      if (i != cnt-1) {
        ret.push(<br key={'br-'+i} />);
      }
    }
    return ret;
  }

}

const getCriteriaToRender = (criteria, grades) => {
  const list = sortBy(prop('id'), values(criteria));
  return filter(crit => has(crit.id, grades), list);
};

const getThumbnail = (img: string) => img.replace(/.jpg$/, ".thumb.jpg");

const bindMicrodata = (display) => (props) => display ? props : {};

export default ReviewListItem;
