import { h, defineComponent, PropType } from 'vue'
import type { Publications } from '../../interface'
import './PubStyle.css?inline'

const interleave = <T,>(arr: T[], thing: T) =>
  arr.flatMap(n => [n, thing]).slice(0, -1);
export default defineComponent({
  name: 'Publications',
  props: {
    pubs: {
      type: Array as PropType<Publications>,
      required: true
      // default: publications
    }
  },
  setup(props) {
    const links: Record<string, { name: string, link: (s: string) => string }> = {
      arxiv: {
        name: 'arXiv preprint',
        link: (s: string) => `https://arxiv.org/abs/${s}`,
      },
      doi: {
        name: 'doi',
        link: (s: string) => `https://doi.org/${s}`,
      },
      hal: {
        name: 'hal',
        link: (s: string) => `https://inria.hal.science/${s}`,
      },
      online: {
        name: 'online',
        link: (s: string) => s,
      },
      slides: {
        name: 'slides',
        link: (s: string) => s,
      },
      github: {
        name: 'github',
        link: (s: string) => `https://github.com/${s}`,
      }
    };

    const formattedLink = (name: string, url: string) => links[name].link(url);
    const getLinkName = (name: string) => links[name].name;
    return {
      formattedLink,
      getLinkName,
    }
  },
  render() {
    return (<div>{this.pubs?.map(pub => (
      <div>
        <h3>{pub.type}</h3>
        <ul>{pub.items.map(item => (<li>
          <div>
            <span class="pubs-title">{item.title}</span>
            <span>, by </span>
            {interleave(item.authors.map(author => (
              <span class="pubs-author">
                {author.link ?
                  (<a href={author.link}>{author.name}</a>) : (author.name)
                }
              </span>)), <span>, </span>)}
          </div>
          {item.venue ? <div class="pubs-venue">{item.venue}</div> : null}
          <div>
            {interleave(item.links.map(link => (<a
              class="pubs-link"
              href={this.formattedLink(link[0], link[1])}
            > {this.getLinkName(link[0])}
            </a>
            )), <span> | </span>)}
          </div>
        </li>
        ))}
        </ul>
      </div>
    ))}
    </div>
    )
  }
})