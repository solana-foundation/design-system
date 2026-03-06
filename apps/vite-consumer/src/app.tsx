'use client';

import { Button } from '@solana/design-system/button';
import { SegmentedControl } from '@solana/design-system/segmented-control';
import { Spinner } from '@solana/design-system/spinner';

export function App() {
    return (
        <div className="min-h-dvh p-6">
            <div className="flex items-center gap-3">
                <Button iconLeft={<Spinner size="sm" />} size="md" variant="primary">
                    Design system button
                </Button>

                <SegmentedControl
                    aria-label="Example segmented control"
                    items={[
                        { label: 'One', value: 'one' },
                        { label: 'Two', value: 'two' },
                    ]}
                />
            </div>
        </div>
    );
}
