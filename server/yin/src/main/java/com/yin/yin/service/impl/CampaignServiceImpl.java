package com.yin.yin.service.impl;

import com.yin.yin.common.PageResult;
import com.yin.yin.mapper.CampaignMapper;
import com.yin.yin.model.Campaign;
import com.yin.yin.model.CampaignPackage;
import com.yin.yin.model.CampaignStatus;
import com.yin.yin.model.CampaignType;
import com.yin.yin.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * 活动服务实现类
 */
@Service
public class CampaignServiceImpl implements CampaignService {

    @Autowired
    private CampaignMapper campaignMapper;

    @Override
    public Campaign getCampaignDetail(Long id) {
        Campaign campaign = campaignMapper.selectById(id);
        if (campaign != null) {
            // 查询关联套餐
            List<CampaignPackage> packages = campaignMapper.selectPackagesByCampaignId(id);
            campaign.setPackages(packages);
        }
        return campaign;
    }

    @Override
    public PageResult<Campaign> listCampaigns(String keyword, Integer type, Integer status, Integer pageNum, Integer pageSize) {
        // 计算分页参数
        Integer offset = (pageNum - 1) * pageSize;
        Integer limit = pageSize;

        // 查询活动列表
        List<Campaign> campaigns = campaignMapper.selectList(keyword, type, status, offset, limit);

        // 查询总数
        Long total = campaignMapper.selectCount(keyword, type, status);

        return new PageResult<>(total, campaigns);
    }

    @Override
    public List<CampaignType> getAllTypes() {
        return campaignMapper.selectAllTypes();
    }

    @Override
    public List<CampaignStatus> getAllStatus() {
        return campaignMapper.selectAllStatus();
    }

    @Override
    @Transactional
    public int addCampaign(Campaign campaign) {
        // 设置默认值
        if (campaign.getStatus() == null) {
            // 根据开始时间和结束时间判断状态
            Date now = new Date();
            if (campaign.getStartTime().after(now)) {
                campaign.setStatus(0); // 未开始
                campaign.setStatusName("未开始");
            } else if (campaign.getEndTime().before(now)) {
                campaign.setStatus(2); // 已结束
                campaign.setStatusName("已结束");
            } else {
                campaign.setStatus(1); // 进行中
                campaign.setStatusName("进行中");
            }
        }

        // 设置类型名称
        if (campaign.getType() != null) {
            List<CampaignType> types = campaignMapper.selectAllTypes();
            for (CampaignType type : types) {
                if (type.getId().equals(campaign.getType())) {
                    campaign.setTypeName(type.getName());
                    break;
                }
            }
        }

        campaign.setCreateTime(new Date());
        campaign.setUpdateTime(new Date());

        // 插入活动
        int result = campaignMapper.insert(campaign);

        // 插入关联套餐
        if (result > 0 && campaign.getPackages() != null && !campaign.getPackages().isEmpty()) {
            for (CampaignPackage pkg : campaign.getPackages()) {
                pkg.setCampaignId(campaign.getId());
                campaignMapper.insertCampaignPackage(pkg);
            }
        }

        return result;
    }

    @Override
    @Transactional
    public int updateCampaign(Campaign campaign) {
        // 设置类型名称
        if (campaign.getType() != null) {
            List<CampaignType> types = campaignMapper.selectAllTypes();
            for (CampaignType type : types) {
                if (type.getId().equals(campaign.getType())) {
                    campaign.setTypeName(type.getName());
                    break;
                }
            }
        }

        // 设置状态名称
        if (campaign.getStatus() != null) {
            List<CampaignStatus> statusList = campaignMapper.selectAllStatus();
            for (CampaignStatus status : statusList) {
                if (status.getId().equals(campaign.getStatus())) {
                    campaign.setStatusName(status.getName());
                    break;
                }
            }
        }

        campaign.setUpdateTime(new Date());

        // 更新活动
        int result = campaignMapper.update(campaign);

        // 更新关联套餐
        if (result > 0 && campaign.getPackages() != null) {
            // 先删除原有关联
            campaignMapper.deleteCampaignPackagesByCampaignId(campaign.getId());

            // 再添加新关联
            for (CampaignPackage pkg : campaign.getPackages()) {
                pkg.setCampaignId(campaign.getId());
                campaignMapper.insertCampaignPackage(pkg);
            }
        }

        return result;
    }

    @Override
    @Transactional
    public int deleteCampaign(Long id) {
        // 先删除关联套餐
        campaignMapper.deleteCampaignPackagesByCampaignId(id);

        // 再删除活动
        return campaignMapper.deleteById(id);
    }
}
