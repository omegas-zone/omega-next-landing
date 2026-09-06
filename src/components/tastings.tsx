'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';

import Rating from '@/components/rating';

import type { Tasting } from '@/types/all';

import './_scss/tastings.scss';

type FilterKey = 'brand' | 'country' | 'type' | 'cask_type';
type SortKey = 'name' | 'rating' | 'region' | 'strength';
type SortDirection = 'asc' | 'desc';

type SortOption = {
    key: SortKey;
    label: string;
    defaultDirection: SortDirection;
};

const sortOptions: SortOption[] = [
    {
        key: 'name',
        label: 'Name',
        defaultDirection: 'asc',
    },
    {
        key: 'rating',
        label: 'Rating',
        defaultDirection: 'desc',
    },
    {
        key: 'region',
        label: 'Region',
        defaultDirection: 'asc',
    },
    {
        key: 'strength',
        label: 'Strength',
        defaultDirection: 'asc',
    },
];

const filterLabels: Record<FilterKey, string> = {
    brand: 'brand',
    country: 'country',
    type: 'type',
    cask_type: 'cask type',
};

function getUniqueValues(tastings: Tasting[], key: FilterKey): string[] {
    return [...new Set(
        tastings
            .map(tasting => tasting[key])
            .filter((value): value is string => Boolean(value))
    )].sort((a, b) => a.localeCompare(b));
}

function compareStrings(a: string | null | undefined, b: string | null | undefined): number {
    return (a ?? '').localeCompare(b ?? '', undefined, {
        sensitivity: 'base',
    });
}

function compareNumbers(a: number | null | undefined, b: number | null | undefined): number {
    return (a ?? 0) - (b ?? 0);
}

export default function Tastings({ tastings }: { tastings: Tasting[] }) {
    const [filters, setFilters] = useState<Record<FilterKey, string>>({
        brand: '',
        country: '',
        type: '',
        cask_type: '',
    });

    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const filterOptions = useMemo(() => ({
        brand: getUniqueValues(tastings, 'brand'),
        country: getUniqueValues(tastings, 'country'),
        type: getUniqueValues(tastings, 'type'),
        cask_type: getUniqueValues(tastings, 'cask_type'),
    }), [tastings]);

    const filteredTastings = useMemo(() => {
        const filtered = tastings.filter(tasting => {
            return (Object.keys(filters) as FilterKey[]).every(key => {
                if (!filters[key]) {
                    return true;
                }

                return tasting[key] === filters[key];
            });
        });

        filtered.sort((a, b) => {
            let result = 0;

            switch (sortKey) {
                case 'name':
                    result = compareStrings(a.name, b.name);
                    break;

                case 'rating':
                    result = compareNumbers(a.rating as number, b.rating as number);
                    break;

                case 'region':
                    result = compareStrings(a.region, b.region);
                    break;

                case 'strength':
                    result = compareNumbers(parseInt(a.strength), parseInt(b.strength));
                    break;
            }

            return sortDirection === 'asc' ? result : -result;
        });

        return filtered;
    }, [tastings, filters, sortKey, sortDirection]);

    const handleFilterChange = (key: FilterKey, value: string) => {
        setFilters(current => ({
            ...current,
            [key]: value,
        }));
    };

    const handleSortChange = (key: SortKey) => {
        if (key === sortKey) {
            setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
            return;
        }

        const option = sortOptions.find(sortOption => sortOption.key === key);

        setSortKey(key);
        setSortDirection(option?.defaultDirection ?? 'asc');
    };

    const resetFilters = () => {
        setFilters({
            brand: '',
            country: '',
            type: '',
            cask_type: '',
        });
    };

    const hasFilters = Object.values(filters).some(Boolean);

    return (<>
        <div className="whisky-controls">
            <div className="whisky-filters">
                <span>Filter:</span>
                {(Object.keys(filterLabels) as FilterKey[]).map(key => (
                    <label key={key}>
                        <select
                            value={filters[key]}
                            onChange={event => handleFilterChange(key, event.target.value)}
                        >
                            <option value="">-- Filter by {filterLabels[key]} --</option>
                            {filterOptions[key].map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </label>
                ))}

                {hasFilters && (<button type="button" className="reset-filters" onClick={resetFilters}>Reset</button>)}
            </div>

            <div className="whisky-sorting">
                <span>Sort:</span>

                {sortOptions.map(option => {
                    const active = sortKey === option.key;

                    return (
                        <button
                            key={option.key}
                            type="button"
                            className={active ? 'is-active' : ''}
                            onClick={() => handleSortChange(option.key)}
                        >
                            {option.label}
                            {active && (<span aria-hidden="true">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>)}
                        </button>
                    );
                })}
            </div>
            <div className="whisky-result-count">
                {filteredTastings.length} {filteredTastings.length === 1 ? 'tasting' : 'tastings'}
            </div>
        </div>


        {filteredTastings.map(tasting => {
            return (
                <div className="whisky-wrapper" key={tasting.id}>
                    <div className="whisky-header">
                        <h2>{tasting.brand}</h2>
                        <h3>{tasting.name}</h3>
                    </div>

                    <div className="rating-wrapper">
                        <Rating rating={tasting.rating as number} />
                    </div>

                    <div className="specs">
                        <div className="spec-label">Origin:</div>
                        <div className="spec-value">
                            {tasting.country} {tasting.region && <>&gt; {tasting.region}</>}
                        </div>

                        <div className="spec-label">Type:</div>
                        <div className="spec-value">{tasting.type}</div>

                        <div className="spec-label">Cask Type:</div>
                        <div className="spec-value">{tasting.cask_type}</div>

                        {tasting.notes && (<>
                            <div className="spec-label">Age:</div>
                            <div className="spec-value">{tasting.age}</div>
                        </>)}

                        <div className="spec-label">Glance:</div>
                        <div className="spec-value">{tasting.glance}</div>

                        <div className="spec-label">Color:</div>
                        <div className="spec-value">
                            <div className="color-swatch" style={{ backgroundColor: tasting.color?.color }}/>
                            {tasting.color?.name}
                        </div>

                        <div className="spec-label">Strength:</div>
                        <div className="spec-value">{tasting.strength}% abv</div>

                        <div className="spec-label">Tasted at:</div>
                        <div className="spec-value">{tasting.location}</div>

                        <div className="spec-label">Date:</div>
                        <div className="spec-value">{tasting.date_of_tasting}</div>

                        <div className="spec-label">Flavour:</div>
                        <div className="spec-value">{tasting.flavours.join(', ')}</div>

                        <div className="spec-label">Finish:</div>
                        <div className="spec-value">{tasting.finish}</div>

                        {tasting.notes && (<>
                            <div className="spec-label">Other notes:</div>
                            <div className="spec-value">{tasting.notes}</div>
                        </>)}
                    </div>

                    {tasting.region ? (<div className="whisky-map">
                        <Image
                            src={'/vector/whisky/' + tasting.region.toLowerCase() + '.svg'}
                            alt=""
                            height={200}
                            width={200}
                        />
                    </div>) : (<div className="whisky-map" />)}
                </div>
            );
        })}
    </>);
}