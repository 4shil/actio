'use client';

export interface ActionItem {
  text: string;
  isDeadline: boolean;
}

export interface ActionGroup {
  title: string | null;
  items: ActionItem[];
}

interface ActionsListProps {
  groups: ActionGroup[];
}

export default function ActionsList({ groups }: ActionsListProps) {
  if (groups.length === 0) return null;

  const hasGroupTitles = groups.some(g => g.title !== null);

  return (
    <div className="actio-card space-y-6">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {hasGroupTitles && group.title && (
            <h3 className="actio-section-title">{group.title}</h3>
          )}
          <ul className="space-y-2">
            {group.items.map((item, itemIndex) => (
              <li key={itemIndex} className="actio-checkbox">
                <span className="actio-checkbox-box" aria-hidden="true" />
                <span className={item.isDeadline ? 'actio-deadline' : ''}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
