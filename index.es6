import React, { PropTypes } from 'react';
import classnames from 'classnames';

import TabView from '@economist/component-tabview';
import AnimatedPanel from '@economist/component-animatedpanel';
import Gobbet from '@economist/component-wifgobbet';
import ImageCaption from '@economist/component-imagecaption';
import Video from '@economist/component-video';
import Omniture from '@economist/component-omniture';
import NotFound from '@economist/component-404';
import Gallery from '@economist/component-gallery';
import Authenticated from '@economist/component-authenticated';

import variantify from './variantify';

const authenticated = new Authenticated();
const articleComponent = {
  Image: 'img',
  Pullquote: 'blockquote',
  ArticleSubHead: 'h3',
  Gobbet,
  ImageCaption,
  Video,
  AnimatedPanel,
  Gallery,
};

const variantTypes = [
  'world-if',
  'world-in',
];

@variantify('ArticleTemplate', variantTypes, 'world-if')
class ArticleTemplate extends React.Component {

  static get propTypes() {
    return {
      id: PropTypes.number.isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      flytitle: PropTypes.string.isRequired,
      rubric: PropTypes.string.isRequired,
      section: PropTypes.string.isRequired,
      mainImage: PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
      }).isRequired,
      content: PropTypes.array.isRequired,
      sections: PropTypes.object.isRequired,
    };
  }

  static addComponentType(component, name) {
    articleComponent[name || component.name] = component;
  }

  renderJSONContents(contents, variantType) {
    return (contents || []).map((contentPiece, key) => {
      if (typeof contentPiece === 'string') {
        return (
          <p key={key} dangerouslySetInnerHTML={{ __html: contentPiece }} />
        );
      }
      const Component = articleComponent[contentPiece.component];
      if (!Component) {
        throw new Error('Unknown component ' + contentPiece.component);
      }
      const children = this.renderJSONContents(contentPiece.content, variantType);
      return (
        <Component
          key={key}
          variantType={variantType}
          {...contentPiece.props}
        >
          {children}
        </Component>
      );
    });
  }

  renderTabView = (variantType) => {
    const notCurrentArticle = (article) => {
      const currentArticleId = this.props.id;
      return currentArticleId !== article.id;
    };

    const sections = this.props.sections;
    const TabViewDefaultClassName = TabView.defaultClassName || 'TabView';
    return (
      <TabView
        variantType={variantType}
      >
        {Object.keys(sections).map((title, key) => (
          <div title={title} key={key} itemScope itemType="http://schema.org/itemList">
            <div
              className={classnames(
                this.props.getVariantClassNames(`${TabViewDefaultClassName}--Views--Tint`)
              )}
            ></div>
            {sections[title].filter(notCurrentArticle).map((article) => (
              <a href={`/article/${article.id}/${article.attributes.slug}`} itemProp="url">
                <figure
                  className={classnames(
                    this.props.getVariantClassNames(`${TabViewDefaultClassName}--View--Content`)
                  )}
                >
                  <img
                    src={`${article.attributes.tileimage['1.0x']}`}
                    srcSet={this.getSrcSet(article.attributes.tileimage)}
                    alt={article.attributes.imagealt}
                    itemProp="image"
                  />
                  <figcaption itemProp="caption">{article.attributes.toc}</figcaption>
                </figure>
              </a>
            ))}
          </div>
        ))}
      </TabView>
    );
  }

  getSrcSet(image) {
    return Object.keys(image).map((key) => `${image[key]} ${key}`).join(',');
  }

  renderHeader = () => {
    if (this.props.variantType === 'world-if') {
      return this.renderWifHeader();
    } else {
      return this.renderWinHeader();
    }
  }

  renderWinSubHeader = () => {
    let byline2 = null;
      return (
        <header
          className={classnames(
            this.props.getVariantClassNames(`${this.props.defaultClassName}--subheader`),
            'margin-l-1',
            'gutter-l',
            'col-10'
          )}
        >
          <h2
            className={classnames(
              this.props.getVariantClassNames(`${this.props.defaultClassName}--byline`),
              'margin-l-1',
              'gutter-l',
              'col-10'
            )}
            itemProp="byline"
          >
            By-line to follow
          </h2>

          <h2
            className={classnames(
              this.props.getVariantClassNames(`${this.props.defaultClassName}--pubdate`),
              'margin-l-1',
              'gutter-l',
              'col-10'
            )}
            itemProp="publishdate"
          >
            Publish date to follow
          </h2>

          <h2
            className={classnames(
              this.props.getVariantClassNames(`${this.props.defaultClassName}--section-section`),
              'margin-l-1',
              'gutter-l',
              'col-10'
            )}
            itemProp="section"
          >
            {this.props.section}
          </h2>
        </header>
      )
  }

  renderWinHeader = () => {
    let section = null;
    let flytitle = null;
    let title = null;
    if (this.props.flytitle) {
      flytitle = (
        <h1
          className={classnames(
            this.props.getVariantClassNames(`${this.props.defaultClassName}--flytitle`),
            'gutter-l',
            'col-10'
          )}
          itemProp="headline"
        >
          {this.props.flytitle}
        </h1>
      );
    }
    if (this.props.title) {
      title = (
        <h3
          className={classnames(
            this.props.getVariantClassNames(`${this.props.defaultClassName}--title`),
            'gutter-l',
            'col-10'
          )}
          itemProp="alternativeHeadline"
        >
          {this.props.title}
        </h3>
      );
    }
    if (flytitle || title) {
      return (
        <header
          className={classnames(
            this.props.getVariantClassNames(`${this.props.defaultClassName}--header`)
          )}
        >
          {flytitle}
          {title}
        </header>
      );
    }
  }

  renderWifHeader = () => {
    let section = null;
    let flytitle = null;
    let title = null;
    if (this.props.flytitle) {
      flytitle = (
        <h1
          className={classnames(
            this.props.getVariantClassNames(`${this.props.defaultClassName}--flytitle`),
            'margin-l-1',
            'gutter-l',
            'col-10'
          )}
          itemProp="headline"
        >
          {this.props.flytitle}
        </h1>
      );
    }
    if (this.props.title) {
      title = (
        <h3
          className={classnames(
            this.props.getVariantClassNames(`${this.props.defaultClassName}--title`),
            'margin-l-1',
            'gutter-l',
            'col-10'
          )}
          itemProp="alternativeHeadline"
        >
          {this.props.title}
        </h3>
      );
    }
    if (flytitle || title) {
      if (this.props.section) {
        section = (
          <h2
            className={classnames(
              this.props.getVariantClassNames(`${this.props.defaultClassName}--header-section`),
              'margin-l-1',
              'gutter-l'
            )}
            itemProp="articleSection"
          >
            {this.props.section}
          </h2>
        );
      }
      return (
        <header
          className={classnames(
            this.props.getVariantClassNames(`${this.props.defaultClassName}--header`)
          )}
        >
          {section}
          {flytitle}
          {title}
        </header>
      );
    }
  }

  render() {
    const contents = this.renderJSONContents(this.props.content, this.props.variantType);
    const tabs = this.renderTabView(this.props.variantType);
    const title = this.props.title || this.props.slug;
    const omnitureProps = {
      pageName: `the_world_if|${this.props.section}|${title}`,
      server: 'economist.com',
      channel: this.props.section,
      prop1: 'the_world_if',
      prop3: 'web',
      prop4: 'article',
      prop5: title,
      prop11: authenticated.getCookie('mm-logged-in-state') ? 'logged_in' : 'not_logged_in',
      prop13: 'anonymous',
      prop31: new Date(),
    };
    let image = null;
    if (this.props.mainImage) {
      image = (
        <img
          className={classnames(
            this.props.getVariantClassNames(`${this.props.defaultClassName}--image`)
          )}
          src={`${this.props.mainImage.src['1.0x']}`}
          srcSet={this.getSrcSet(this.props.mainImage.src)}
          alt={this.props.mainImage.alt}
          itemProp="image"
        />
      );
    }
    return (
      <article
        className={classnames(
          this.props.getVariantClassNames(`${this.props.defaultClassName}--container`)
        )}
        data-section={this.props.section}
        itemScope
        itemType="http://schema.org/NewsArticle"
      >
        <div
          className={classnames(
            this.props.getVariantClassNames(`${this.props.defaultClassName}--imagecontainer`)
          )}
        >
          <div
            className={classnames(
              this.props.getVariantClassNames(`${this.props.defaultClassName}--imagecontainer-inner`)
            )}
          >
            {image}
            {this.renderHeader()}
          </div>
        </div>
        {this.renderWinSubHeader()}

        {this.props.variantType === 'world-if' ?

          <p
            className={classnames(
              this.props.getVariantClassNames(`${this.props.defaultClassName}--rubric`),
              'margin-l-1',
              'gutter-l',
              'col-10'
            )}
            itemProp="description"
          >
            {this.props.rubric}
          </p>

        : ''}

        <section
          className={classnames(
            this.props.getVariantClassNames(`${this.props.defaultClassName}--section`),
          )}
          itemProp="articleBody"
        >
          {contents}
        </section>

        {this.props.variantType === 'world-in' ?
          <div
            className={classnames(
              this.props.getVariantClassNames(`${this.props.defaultClassName}--byline-footer`),
              'margin-l-1',
              'gutter-l',
              'col-10'
            )}
          >
            <h3
              className={classnames(
                this.props.getVariantClassNames(`${this.props.defaultClassName}--byline`),
                'margin-l-1',
                'gutter-l',
                'col-10'
              )}
              itemProp="byline"
            >
              Zanny Minton Beddoes
            </h3>
            <span
              className={classnames(
                this.props.getVariantClassNames(`${this.props.defaultClassName}--byline-details`),
                'gutter-l',
                'col-10'
              )}
              itemProp="bylinedetails"
            >
            business affairs editor, The Economist
            </span>
          </div>
        : ''}
        <Omniture {...omnitureProps} />
      </article>
    );
  }
}

export default ArticleTemplate;
